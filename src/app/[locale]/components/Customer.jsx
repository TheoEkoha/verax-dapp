"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import CardActions from "@mui/material/CardActions";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";

import { contractAddress, contractAbi } from "../../../constants";
import { publicClient } from "../../../utils/client";

const Customer = () => {
  const { address } = useAccount();
  const {
    data: isAcustomer,
    error: errorIsAcustomer,
    isPending: isPendingIsAcustomer,
    refetch: refetchIsAcustomer,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isAcustomer",
    account: address,
  });

  const [value, setValue] = React.useState(0);
  const [products, setProducts] = useState([]);
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

  
  const getUserIdsProductsToRate = async () => {

    try {

      console.log("is a customer -> ", isAcustomer)
      if (!isAcustomer)
        return []
    } catch (error) {
      handleOpenSnack({ stat: true, type: "error", message: error.message });
    }

    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getUserIdsProductsToRate",
        account: address,
      });
      setProducts(
        data.map((row, key) => {
          console.log("row.compagnyId --> ", row.compagnyId);
          
          // Convertir compagnyId en Number uniquement s'il est dans la limite
          let compagnyIdNumber;
          if (row.compagnyId <= BigInt(Number.MAX_SAFE_INTEGER)) {
            compagnyIdNumber = Number(row.compagnyId);
          } else {
            compagnyIdNumber = row.compagnyId.toString(); // Conservez-le comme string si trop grand
            console.log("La valeur est trop grande pour Number, utilisez BigInt ou string à la place :", compagnyIdNumber);
          }
      
          return {
            id: Number(key),
            productId: Number(row.productId),
            compagnyId: compagnyIdNumber,
          };
        })
      );
      
    } catch (error) {
      handleOpenSnack({ stat: true, type: "error", message: error.message });
    }
  };

  const getProductDetailsById = async (idProduct) => {
    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getProductDetailsById",
        account: address,
        args: [idProduct],
      });
      return data;
    } catch (error) {
      handleOpenSnack({ stat: true, type: "error", message: error.message });
    }
  };

  useEffect(() => {
    getUserIdsProductsToRate();
  }, []);

  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  const handleRatingChange = (productId, newValue) => {
    setRatings((prevState) => ({
      ...prevState,
      [productId]: newValue,
    }));
  };

  const handleCommentChange = (productId, event) => {
    setComments((prevState) => ({
      ...prevState,
      [productId]: event.target.value,
    }));
  };

  const {
    data: hash,
    isPending: isPending,
    writeContract: writeContract,
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

  const addFeedback = async (
    _compagnyId,
    _productId,
    _note,
    _comment,
    _purchaseDate,
    _likeCount
  ) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "addFeedback",
      args: [
        address,
        _compagnyId,
        _productId,
        _note,
        _comment,
        _purchaseDate,
        _likeCount,
      ],
      account: address,
    });
  };

  const handleSubmit = async (_productId, _compagnyId) => {
    const rating = ratings[_productId];
    const comment = comments[_productId];

    const compagnyId = _compagnyId;
    const date = 1711753200;
    const like = 0;
    await addFeedback(compagnyId, _productId, rating, comment, date, like);
    // console.log(
    //   `Commpagny : ${_compagnyId} - Product ${_productId}: Note - ${rating}, Comment - ${comment}, date achat - ${date}, like - ${like}`
    // );
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: errorConfirmation,
  } = useWaitForTransactionReceipt({
    hash,
  });
  useEffect(() => {
    if (isConfirmed) {
      getUserIdsProductsToRate();
      handleOpenSnack({
        stat: true,
        type: "success",
        message: "Transaction has been registered",
      });
    }
    if (errorConfirmation) {
      handleOpenSnack({
        stat: true,
        type: "error",
        message: errorConfirmation.message,
      });
    }
  }, [isConfirmed, errorConfirmation]);

  const ChildComponent = ({ id }) => {
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getProductDetailsById(id);
          setProductDetails(data);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchData();
    }, [id]);

    return (
      <div>
        {productDetails && (
          <Typography variant="h5" component="div">
            Référence produit : {productDetails.productRef}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <Container maxWidth="sm">
      <div
        style={{
          padding: 10,
          marginTop: 20,
          backgroundColor: "#ECF0F1",
        }}
      >
        <b>Clients</b>
        <br />
        Client : {address}
      </div>

      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          paddingBottom: 5,
        }}
      >
        {hash && (
          <Divider style={{ marginTop: 10 }}>
            <Chip label={hash} size="small" />
          </Divider>
        )}
        {products &&
          products.map(
            (row) =>
              row.productId != 0 &&
              row.allowed != false && (
                <Box sx={{ minWidth: 275, marginTop: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <ChildComponent id={row.productId} />
                      Identifiant Produit : {row.productId}
                      <br />
                      Identifiant Compagnie : {row.compagnyId.toString()}
                      <Box
                        sx={{
                          "& > legend": { mt: 2 },
                        }}
                      >
                        <Typography component="legend">Note</Typography>
                        <Rating
                          name={`rating-${row.productId}`}
                          value={ratings[row.productId] || 0}
                          onChange={(event, newValue) =>
                            handleRatingChange(row.productId, newValue)
                          }
                        />
                      </Box>
                      <Box
                        sx={{
                          "& > legend": { mt: 2 },
                        }}
                      >
                        <Typography component="legend">Commentaire</Typography>
                        <TextField
                          label="Comment était votre expérience ?"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={comments[row.productId] || ""}
                          onChange={(event) =>
                            handleCommentChange(row.productId, event)
                          }
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() =>
                          handleSubmit(row.productId, row.compagnyId)
                        }
                      >
                        Valider
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              )
          )}
      </div>
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
          {stateSnack.message
            ? stateSnack.message
            : "Error occurred while processing your request"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Customer;
