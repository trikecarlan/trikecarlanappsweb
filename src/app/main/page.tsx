"use client"

import Layout from "@/components/Layout";
import { getDatabase, onValue, ref } from "firebase/database";
import Link from "next/link"
import { useEffect, useState } from "react";
import { app } from "../../../firebaseConfig";


const Reports = () => {

    return (
        <Layout title="Dahboard">
            <p>Dashboard</p>
        </Layout>
    )
}

export default Reports;