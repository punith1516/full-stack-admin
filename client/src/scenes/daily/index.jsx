import React, { useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const theme = useTheme();
  const { data } = useGetSalesQuery();

  // Default date range
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));

  // Format and filter data for the chart
  const secondaryPalette = theme.palette.secondary;

  const formattedData = useMemo(() => {
    if (!data || !data.dailyData) return [];

    const { dailyData } = data;
    const totalSalesLine = {
      id: "Total Sales",
      color: secondaryPalette.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "Total Units",
      color: secondaryPalette[600],
      data: [],
    };

    dailyData.forEach(({ date, totalSales, totalUnits }) => {
      const dateObj = new Date(date);
      if (dateObj >= startDate && dateObj <= endDate) {
        const formattedDate = dateObj.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        totalSalesLine.data.push({ x: formattedDate, y: totalSales });
        totalUnitsLine.data.push({ x: formattedDate, y: totalUnits });
      }
    });

    return [totalSalesLine, totalUnitsLine];
  }, [data, startDate, endDate, secondaryPalette]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />

      {/* Date Pickers with Proper Alignment */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mb={2}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            Start Date:
          </Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            wrapperClassName="datePicker"
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            End Date:
          </Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            wrapperClassName="datePicker"
          />
        </Box>
      </Box>

      {/* Line Chart */}
      <Box height="75vh">
        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.secondary[200] } },
                ticks: {
                  line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
                  text: { fill: theme.palette.secondary[200] },
                },
              },
              legends: { text: { fill: theme.palette.secondary[200] } },
              tooltip: { container: { color: theme.palette.primary.main } },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45, // Rotates for better readability
              legend: "Date",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                translateX: 50,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
