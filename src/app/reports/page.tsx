"use client";

import Layout from "@/components/Layout";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "../../../firebaseConfig";

interface Report {
    address: string;
    dateCreated: string;
    dateOfIncident: string;
    images: string[];
    phoneNumber: string;
    reportType: string;
    reporterName: string;
    reporterProfile: string;
    sideCartNumber: string;
    signature: string;
    status: "Pending" | "Processing" | "Resolved";
    type: string;
}

interface UserReports {
    [entryKey: string]: Report;
}

interface Reports {
    [reportKey: string]: {
        [userKey: string]: UserReports;
    };
}

const Reports = () => {
    const database = getDatabase(app);
    const [reports, setReports] = useState<Reports | null>(null);

    const userRef = ref(database, 'reports/');
    useEffect(() => {
        const fetchReports = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setReports(data);
        });

        return () => {
            fetchReports();
        };
    }, []);

    const updateReportStatus = (reportKey: string, userKey: string, entryKey: string, newStatus: "Processing" | "Resolved") => {
        const reportRef = ref(database, `reports/${reportKey}/${userKey}/${entryKey}`);
        update(reportRef, { status: newStatus })
            .then(() => {
                setReports((prevReports) => {
                    if (prevReports) {
                        const updatedReports = { ...prevReports };
                        updatedReports[reportKey][userKey][entryKey].status = newStatus;
                        return updatedReports;
                    }
                    return prevReports;
                });
            })
            .catch((error) => {
                console.error("Error updating report status: ", error);
            });
    };

    const renderReports = () => {
        if (!reports) return null;

        return Object.keys(reports).map((reportKey) => {
            return Object.keys(reports[reportKey]).map((userKey) => {
                return Object.keys(reports[reportKey][userKey]).map((entryKey) => {
                    const report = reports[reportKey][userKey][entryKey];
                    return (
                        <div key={entryKey} className="bg-white flex justify-between gap-4 shadow-md rounded p-4 mb-4">
                            <div className="flex flex-col gap-2 items-start justify-center">
                                <div className="flex gap-2 items-center">
                                    <img src={report.reporterProfile} alt="Report Image" className="h-12 w-12 object-cover rounded-full" />
                                    <div className="text-lg font-bold">{report.reporterName}</div>
                                </div>
                                <div className="flex flex-col gap-2 pl-14">
                                    {report.status === "Pending" && <div className={`text-white px-4 py-1 w-max bg-yellow-400`}>{report.status}</div>}
                                    {report.status === "Processing" && <div className={`text-white px-4 w-max py-1 bg-indigo-600`}>{report.status}</div>}
                                    {report.status === "Resolved" && <div className={`text-white px-4 w-max py-1 bg-green-500`}>{report.status}</div>}
                                    <div><strong>Complaint ID:</strong> {entryKey}</div>
                                    <div><strong>Complaint Type:</strong> {report.reportType}</div>
                                </div>
                            </div>
                            <div className="my-2">
                                <img src={report.images[0]} alt="Report Image" className="w-full h-40 object-cover rounded" />
                            </div>
                            <div className="flex flex-col justify-between items-end">
                                <div className="text-sm">{report.dateOfIncident}</div>
                                <div className="flex gap-2">
                                    <button className="bg-blue-500 h-max text-white px-3 py-1 rounded">Details</button>
                                    {report.status === "Processing" && <button onClick={() => updateReportStatus(reportKey, userKey, entryKey, "Resolved")} className="bg-green-500 h-max text-white px-3 py-1 rounded">Resolve</button>}
                                    {report.status === "Pending" ? (
                                        <>
                                            <button onClick={() => updateReportStatus(reportKey, userKey, entryKey, "Processing")} className="bg-yellow-500 h-max text-white px-3 py-1 rounded">Process</button>
                                            <button onClick={() => updateReportStatus(reportKey, userKey, entryKey, "Resolved")} className="bg-green-500 h-max text-white px-3 py-1 rounded">Resolve</button>
                                        </>
                                    ) : (
                                        <button className="bg-purple-500 h-max text-white px-3 py-1 rounded">Print</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                });
            });
        });
    };

    return (
        <Layout title="Reports">
            <div className="p-4">
                {renderReports()}
            </div>
        </Layout>
    );
};

export default Reports;
