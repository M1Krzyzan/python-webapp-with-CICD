import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import { OrderReportItem, useGetOrders } from "../api/ordersApi.ts"; // <-- import interface

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Admin = () => {
  const [filters, setFilters] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const {
    data = [],
    isLoading,
    isError,
  } = useGetOrders(filters.startDate, filters.endDate);

  const transportBarChartData = {
    labels: data.map((row: OrderReportItem) => row.region),
    datasets: [
      {
        label: "Order Count",
        data: data.map((row: OrderReportItem) => row.order_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const valueBarChartData = {
    labels: data.map((row: OrderReportItem) => row.region),
    datasets: [
      {
        label: "Income",
        data: data.map((row: OrderReportItem) => row.amount),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <Box sx={{ padding: "16px",
      backgroundColor:"#ffffff" }}>
      <Typography
        variant="h4"
        color={"black"}
        sx={{ marginBottom: "2rem", marginTop: "1rem", textAlign: "center" }}
      >
        Admin Panel - Reports
      </Typography>

      {/* Date pickers */}
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          justifyContent: "space-evenly",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(newValue) =>
              setFilters({ ...filters, startDate: newValue })
            }
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(newValue) =>
              setFilters({ ...filters, endDate: newValue })
            }
          />
        </LocalizationProvider>
      </Box>

      {isLoading && <Typography>Loading data...</Typography>}
      {isError && <Typography color="error">Error fetching data</Typography>}

      <Box sx={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
        <Box sx={{ flex: 1, height: "400px" }}>
          <Bar data={transportBarChartData} options={chartOptions} />
        </Box>
        <Box sx={{ flex: 1, height: "400px" }}>
          <Bar data={valueBarChartData} options={chartOptions} />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: "3rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number of Transports</TableCell>
              <TableCell>Transport Value</TableCell>
              <TableCell>Destination Region</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: OrderReportItem, index: number) => (
              <TableRow key={index}>
                <TableCell>{row.order_count}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Admin;
