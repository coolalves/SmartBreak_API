const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Definir o modelo do documento Values no MongoDB
const Values = mongoose.model(
  "Values",
  new mongoose.Schema({
    electricityValue: Number,
    lastUpdate: Date,
  })
);

// GET média do preço kWh das empresas de energia em Portugal
router.get("/", async (req, res) => {
  try {
    const websiteUrl = "https://luzegas.pt/faq/preco-kwh";

    const response = await axios.get(websiteUrl);
    const html = response.data;

    const $ = cheerio.load(html);
    const tableRows = $("table.table tbody tr");

    const values = [];
    let count = 0; // contador para controlar o número de valores adicionados

    tableRows.each((index, element) => {
      const priceValue = $(element).find("td:nth-child(2)").text().trim();
      const numericValue = parseFloat(priceValue.replace(",", "."));

      if (!isNaN(numericValue)) {
        values.push(numericValue);
        count++;

        if (count === 6) {
          return false; // interrompe o loop após obter os primeiros 6 valores -> a tabela tem 6 empresas, a restante tabela é relativa ao preço do gás natural
        }
      }
    });

    console.log("Valores:", values);

    const average = calculateAverage(values);
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

    res.status(200).json({ average });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// função auxiliar que calcula a média
function calculateAverage(values) {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

module.exports = router;
