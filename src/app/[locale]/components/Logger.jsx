"use client";
import { React, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { contractAddress, contractAbi } from "../../../constants";
import { publicClient } from "../../../utils/client";

const CONTRACT_BLOCK_NUMBER = process.env.CONTRACT_BLOCK_NUMBER || "";

const Logger = () => {
  // Un State pour stocker les events
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const logs = await publicClient.getContractEvents({
      address: contractAddress,
      abi: contractAbi,
      // fromBlock: 0n,
      fromBlock: 5641519n, //sepolia
      toBlock: "latest",
    });
    setLogs(
      logs.map((log) => ({
        name: log.eventName,
        blockHash: log.blockHash,
        key: Object.keys(log.args)[0],
        compagnyId: Number(log.args.compagnyId),
        ownerAddr: log.args.ownerAddr,
        productRef: log.args.productRef,
      }))
    );
    console.log(logs);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      fetchLogs();
    };
    getAllEvents();
  }, []);

  return (
    <Card variant="outlined">
      <CardContent>
        <Divider style={{ marginBottom: 10 }}>Évènement du Smart Contract</Divider>
        {logs &&
          logs.map((log) => {
            return (
              (log.name === "CompagnyRegistered" ||
                log.name === "ProductRegistered") && (
                <div style={{ marginBottom: 8 }}>
                  <Typography
                    color="text.secondary"
                    variant="h9"
                    key={crypto.randomUUID()}
                  >
                    {log.name === "CompagnyRegistered" && (
                      <>
                        <div>
                          <b>{log.name}</b> ::: IDENTIFIANT COMPAGNIE : {log.compagnyId}
                        </div>
                        <div>Owner : {log.ownerAddr}</div>
                      </>
                    )}
                    {log.name === "ProductRegistered" && (
                      <>
                        <div>
                          <b>{log.name}</b> ::: IDENTIFIANT COMPAGNIE : {log.compagnyId}
                          <div>Référence produit : {log.productRef}</div>
                        </div>
                      </>
                    )}
                  </Typography>
                </div>
              )
            );
          })}
      </CardContent>
      {/* <CardActions>
        <Button size="large" onClick={fetchLogs}>
          Rafraîchir les évènements
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default Logger;
