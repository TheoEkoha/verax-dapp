"use client";
import React, { useState, useEffect, FC } from "react";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Fingerprint from "@mui/icons-material/Fingerprint";
import CardActions from "@mui/material/CardActions";
import { FeedBack } from "./FeedBack";
import Customer from "./Customer"; // Si c'est un export par défaut
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { contractAddress, contractAbi } from "../../../constants";
import { publicClient } from "../../../utils/client";
import { Button, List, ListItem } from "@mui/material"; // Importez ces composants pour le menu

const OtherUser = () => {
  const { address } = useAccount();
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("allFeedbacks"); // État pour le menu

  const [stateSnack, setStateSnack] = useState({
    stat: false,
    type: "error",
    message: "Error occurred while processing your request",
  });

  const handleOpenSnack = (input) =>
    setStateSnack({
      stat: input.stat,
      type: input.type,
      message: input.message,
    });

  const handleCloseSnack = () =>
    setStateSnack({
      stat: false,
      type: stateSnack.type,
      message: stateSnack.message,
    });

  const {
    data: hash,
    isPending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        handleOpenSnack({
          stat: true,
          type: "success",
          message: "Transaction add customer in progress",
        });
      },
      onError: (error) => {
        handleOpenSnack({
          stat: true,
          type: "error",
          message: error.shortMessage,
        });
        console.log(error);
      },
    },
  });

  const like = async (_feedbackId) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "likeFeedback",
      args: [_feedbackId],
      account: address,
    });
  };

  const getAllFeedback = async () => {
    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getAllFeedback",
        account: address,
      });
      setFeedbacks(
        data.map((row, key) => ({
          id: Number(key),
          productId: Number(row.productId),
          compagnyId: Number(row.compagnyId),
          note: Number(row.note),
          comment: row.comment,
          likeCount: row.likeCount,
        }))
      );
    } catch (error) {
      handleOpenSnack({ stat: true, type: "error", message: error.message });
    }
  };

  useEffect(() => {
    getAllFeedback();
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {/* Menu vertical */}
          <Box sx={{ borderRight: '1px solid #ccc', height: '100vh', padding: 2 }}>
            <List>
              <ListItem>
                <Button onClick={() => setActiveTab("allFeedbacks")}>Tout les avis</Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => setActiveTab("myFeedbacks")}>Mes avis</Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => setActiveTab("rateProduct")}>Noter un produit</Button>
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={9}>
          {activeTab === "allFeedbacks" && (
          <Box sx={{ padding: 2 }}>
            <Divider textAlign="left">Tout les avis</Divider>
            {hash && (
              <Divider style={{ marginTop: 10 }}>
                <Chip label={hash} size="small" />
              </Divider>
            )}
              <Grid container spacing={2}>
                {feedbacks &&
                  feedbacks.map((row, i) =>
                    row.productId !== 0 && row.allowed !== false ? (
                      <Grid item xs={12} sm={6} key={row.id}>
                        <Box sx={{ minWidth: 275, marginTop: 2 }}>
                          <FeedBack
                            likeCount={Number(row.likeCount)}
                            handleLike={() => like(row.id)}
                            description={row.comment}
                            owner={row.owner}
                            company={row.compagnyId}
                            productId={row.productId}
                            note={Number(row.note)}
                          />
                        </Box>
                      </Grid>
                    ) : null
                  )}
              </Grid>
            </Box>
            )}
            {activeTab === "myFeedbacks" && (
          <Box sx={{ padding: 2 }}>
            <Divider textAlign="left">Mes avis</Divider>
            {hash && (
              <Divider style={{ marginTop: 10 }}>
                <Chip label={hash} size="small" />
              </Divider>
            )}
              <Grid container spacing={2}>
                {feedbacks &&
                  feedbacks.map((row, i) =>
                    row.productId !== 0 && row.allowed !== false ? (
                      <Grid item xs={12} sm={6} key={row.id}>
                        <Box sx={{ minWidth: 275, marginTop: 2 }}>
                          <FeedBack
                            likeCount={Number(row.likeCount)}
                            handleLike={() => like(row.id)}
                            description={row.comment}
                            owner={row.owner}
                            company={row.compagnyId}
                            productId={row.productId}
                            note={Number(row.note)}
                          />
                        </Box>
                      </Grid>
                    ) : null
                  )}
              </Grid>
            </Box>
            )}
            {activeTab === "rateProduct" && (
          <Box sx={{ padding: 2 }}>
            <Divider textAlign="left">Noter un produit</Divider>
            {hash && (
              <Divider style={{ marginTop: 10 }}>
                <Chip label={hash} size="small" />
              </Divider>
            )}
            
            <Customer isAcustomer={true} />
            </Box>
            )}
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={stateSnack.stat}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={stateSnack.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {stateSnack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OtherUser;
