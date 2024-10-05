"use client";
import React, { useState, useEffect } from "react";

import CustomerComponent from "./Customer";
import CompagnyComponent from "./Compagny";
import OtherUserComponent from "./OtherUser";

const User = ({ isAcustomer, isAcompagnyOwner }) => {
  return (
    <>
      {isAcustomer && <CustomerComponent isAcustomer={isAcustomer} />}
      {isAcompagnyOwner && (
        <CompagnyComponent isAcompagnyOwner={isAcompagnyOwner} />
      )}
      {!isAcompagnyOwner && !isAcustomer && <OtherUserComponent />}
    </>
  );
};

export default User;
