import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels,
  datasets: [
    {
      label: "Paid",
      data: labels.map(() => Math.floor(Math.random() * 5000)),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Pending",
      data: labels.map(() => Math.floor(Math.random() * 5000)),
      backgroundColor: "rgba(255, 206, 86, 0.5)",
    },
    {
      label: "Overdue",
      data: labels.map(() => Math.floor(Math.random() * 5000)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const InvoiceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar options={options} data={data} />
      </CardContent>
    </Card>
  );
};

export default InvoiceChart;
