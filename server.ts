import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Loan Advisor endpoint using Gemini 3.6 Flash
  app.post("/api/loan-advisor", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is missing on server.",
        });
      }

      const {
        loanAmount,
        interestRate,
        tenureYears,
        tenureMonths,
        emi,
        totalInterest,
        totalPayment,
        currencySymbol = "₹",
        prepaymentAmount = 0,
        prepaymentFrequency = "none",
        loanType = "Home Loan",
      } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a certified senior financial planner and loan expert. Analyze the following loan details and give a concise, high-value, actionable report with bullet points.
      
Loan Details:
- Loan Type: ${loanType}
- Principal Amount: ${currencySymbol}${Number(loanAmount).toLocaleString()}
- Interest Rate: ${interestRate}% p.a.
- Tenure: ${tenureYears} Years ${tenureMonths > 0 ? tenureMonths + " Months" : ""}
- Calculated Monthly EMI: ${currencySymbol}${Number(emi).toLocaleString()}
- Total Interest Payable: ${currencySymbol}${Number(totalInterest).toLocaleString()}
- Total Repayment Amount: ${currencySymbol}${Number(totalPayment).toLocaleString()}
${prepaymentAmount > 0 ? `- Planned Extra Prepayment: ${currencySymbol}${Number(prepaymentAmount).toLocaleString()} (${prepaymentFrequency})` : ""}

Please structure your response into 4 distinct sections:
1. 📊 **Financial Burden Assessment**: Is this loan healthy based on average debt-to-income benchmarks?
2. 💡 **Interest Optimization Strategies**: Specific tips to reduce total interest (e.g., extra monthly payment, annual lump sum, tenure reduction vs EMI reduction).
3. 🏛️ **Tax Benefits & Government Rules**: Tax savings under applicable income tax sections (e.g., Section 24b and 80C for India if ₹ currency, or standard home mortgage deductions).
4. ⚠️ **Critical Warnings & Pitfalls**: Hidden charges to watch out for (prepayment penalties, floating vs fixed rate risks, insurance bundled in loans).

Keep the language clear, encouraging, structured with markdown bold headers and emoji bullet points. Avoid fluffy intro/outro greetings.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const adviceText = response.text || "No response generated from AI Advisor.";

      return res.json({ advice: adviceText });
    } catch (err: any) {
      console.error("Error in /api/loan-advisor:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI financial advice.",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
