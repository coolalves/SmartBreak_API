const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const Values = require("../models/valuesModel");
const cron = require("node-cron");

// Função para obter o novo valor da eletricidade e atualizar a BD
async function updateElectricityValue() {
  try {
    const electricityURL = "https://luzegas.pt/faq/preco-kwh";

    const response = await axios.get(electricityURL);
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

async function updateFuelValue() {
  try {
    const fuelURL = "https://www.tolls.eu/fuel-prices";

    const response = await axios.get(fuelURL);
    const html = response.data;

    const $ = cheerio.load(html);
    const fuelTable = $("#fuel-prices-table #fuel-table");

    const gasoline95Prices = [];
    const dieselPrices = [];

    fuelTable.find(".tr").each((index, element) => {
      const country = $(element).find(".th").first().text().trim();
      if (country === "Portugal") {
        const gasolinePrice = $(element).find(".td:nth-child(2)").text().trim();
        const dieselPrice = $(element).find(".td:nth-child(3)").text().trim();

        const numericGasolinePrice = parseFloat(
          gasolinePrice.replace("€", "").trim()
        );
        const numericDieselPrice = parseFloat(
          dieselPrice.replace("€", "").trim()
        );

        if (!isNaN(numericGasolinePrice)) {
          gasoline95Prices.push(numericGasolinePrice);
        }

        if (!isNaN(numericDieselPrice)) {
          dieselPrices.push(numericDieselPrice);
        }
      }
    });

    //console.log("Gasoline 95:", gasoline95Prices);
    //console.log("Diesel:", dieselPrices);

    const values = gasoline95Prices.concat(dieselPrices);
    //console.log("values:" + values);

    const fuelAverage = calculateAverage(values);

    console.log("Preço médio:", fuelAverage);

    // Obter a data e hora atual com o fuso horário de Portugal Continental
    const lastUpdate = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Lisbon",
    });

    // Atualizar o valor da média e o campo lastUpdate na coleção Values do MongoDB
    await Values.findOneAndUpdate(
      {},
      { fuelValue: fuelAverage, lastUpdate },
      { upsert: true }
    );

    console.log("Preço dos combustíveis atualizado com sucesso.");
  } catch (err) {
    console.error("Erro ao obter o preço dos combustíveis:", err);
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

// Atualiza combustiveis de 15 em 15 dias
cron.schedule("0 0 */15 * *", updateFuelValue);

// Rota GET para obter o valor atualizado da eletricidade
router.get("/", async (req, res) => {
  try {
    // Obter o valor atual da eletricidade da coleção Values do MongoDB
    const { electricityValue, fuelValue } = await Values.findOne();

    res.status(200).json({
      averageElectricity: electricityValue,
      averageFuel: fuelValue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
