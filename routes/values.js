const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const Values = require("../models/valuesModel");
const cron = require("node-cron");

// Função para obter o novo valor da eletricidade e atualizar a BD
async function updateElectricityValue() {
  try {
    const websiteUrl = "https://luzegas.pt/faq/preco-kwh";

    const response = await axios.get(websiteUrl);
    const html = response.data;

    const $ = cheerio.load(html);
    const firstTable = $("table.table").first();
    const tableRows = firstTable.find("tbody tr");

    const values = [];

    tableRows.each((index, element) => {
      const priceValue = $(element).find("td:nth-child(2)").text().trim();
      const numericValue = parseFloat(priceValue.replace(",", "."));

      if (!isNaN(numericValue)) {
        values.push(numericValue);
      }
    });

    console.log("Valores:", values);

    const average = calculateAverage(values);

    if (typeof average !== "number") {
      console.error("Erro ao calcular a média");
      return;
    }

    console.log("Preço médio:", average);

    // Obter a data e hora atual com o fuso horário de Portugal Continental
    const lastUpdate = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Lisbon",
    });

    // Atualizar o valor da média e o campo lastUpdate na coleção Values do MongoDB
    await Values.findOneAndUpdate(
      {},
      { electricityValue: average, lastUpdate },
      { upsert: true }
    );

    console.log("Valor da eletricidade atualizado com sucesso.");
  } catch (err) {
    console.error("Erro ao obter o valor da eletricidade:", err);
  }
}

// Função auxiliar que calcula a média
function calculateAverage(values) {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

// Agendar a tarefa para ser executada no primeiro dia de cada mês às 00:00
cron.schedule("0 0 1 * *", updateElectricityValue);

// Rota GET para obter o valor atualizado da eletricidade
router.get("/", async (req, res) => {
  try {
    // Obter o valor atual da eletricidade da coleção Values do MongoDB
    const { electricityValue } = await Values.findOne();

    res.status(200).json({ average: electricityValue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
