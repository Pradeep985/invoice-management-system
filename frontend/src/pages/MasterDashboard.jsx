import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";

import PageContainer from "../components/common/PageContainer";

export default function MasterDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Customers",
      icon: <PeopleAltIcon fontSize="large" />,
      path: "/master/customers",
      color: "primary"
    },
    {
      title: "Items",
      icon: <InventoryIcon fontSize="large" />,
      path: "/master/items",
      color: "success"
    }
  ];

  return (
    <PageContainer title="Master Data">
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                width:"150px",
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}
            >
              <CardActionArea onClick={() => navigate(card.path)}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    py: 4
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "50%",
                      bgcolor: `${card.color}.light`,
                      color: `${card.color}.dark`,
                      mb: 2
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography variant="h6" fontWeight={700}>
                    {card.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}