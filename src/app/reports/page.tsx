"use client";

import Layout from "@/components/Layout";
import { getDatabase, onValue, ref, update, remove } from "firebase/database";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [statusSort, setStatusSort] = useState("All");
    const [reportTypeSort, setReportTypeSort] = useState("All");

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

    const deleteReport = (reportKey: string, userKey: string, entryKey: string) => {
        const reportRef = ref(database, `reports/${reportKey}/${userKey}/${entryKey}`);
        remove(reportRef)
            .then(() => {
                setReports((prevReports) => {
                    if (prevReports) {
                        const updatedReports = { ...prevReports };
                        delete updatedReports[reportKey][userKey][entryKey];
                        if (Object.keys(updatedReports[reportKey][userKey]).length === 0) {
                            delete updatedReports[reportKey][userKey];
                        }
                        if (Object.keys(updatedReports[reportKey]).length === 0) {
                            delete updatedReports[reportKey];
                        }
                        return updatedReports;
                    }
                    return prevReports;
                });
            })
            .catch((error) => {
                console.error("Error deleting report: ", error);
            });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusSort = (status: string) => {
        setStatusSort(status);
    };

    const handleReportTypeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setReportTypeSort(event.target.value);
    };

    const filteredReports = () => {
        if (!reports) return [];

        let reportList: { reportKey: string, userKey: string, entryKey: string, report: Report }[] = [];
        Object.keys(reports).forEach((reportKey) => {
            Object.keys(reports[reportKey]).forEach((userKey) => {
                Object.keys(reports[reportKey][userKey]).forEach((entryKey) => {
                    const report = reports[reportKey][userKey][entryKey];
                    if (entryKey.includes(searchTerm)) {
                        if ((statusSort === "All" || report.status === statusSort) &&
                            (reportTypeSort === "All" || report.reportType === reportTypeSort)) {
                            reportList.push({ reportKey, userKey, entryKey, report });
                        }
                    }
                });
            });
        });

        return reportList;
    };

    const renderReports = () => {
        const sortedFilteredReports = filteredReports().reverse();

        if (sortedFilteredReports.length === 0) {
            return (
                <div className="text-center">No available data</div>
            )
        }

        return sortedFilteredReports.map(({ reportKey, userKey, entryKey, report }) => (
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
                        <button onClick={() => deleteReport(reportKey, userKey, entryKey)} className="bg-red-500 h-max text-white px-3 py-1 rounded">Delete</button>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <Layout title="Reports">
            <div className="overflow-auto bg-gray-200 h-[100vh]">
                <div className="flex flex-wrap p-4 bg-gray-300 sticky top-0 justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button className={`${statusSort === "All" ? "bg-white" : ""} px-2 rounded-lg`} onClick={() => handleStatusSort("All")}>All</button>
                        <button className={`${statusSort === "Pending" ? "bg-white" : ""} px-2 rounded-lg`} onClick={() => handleStatusSort("Pending")}>Pending</button>
                        <button className={`${statusSort === "Processing" ? "bg-white" : ""} px-2 rounded-lg`} onClick={() => handleStatusSort("Processing")}>Processing</button>
                        <button className={`${statusSort === "Resolved" ? "bg-white" : ""} px-2 rounded-lg`} onClick={() => handleStatusSort("Resolved")}>Resolved</button>
                    </div>
                    <select className="border-2 rounded-lg px-2" name="reportType" id="reports" value={reportTypeSort} onChange={handleReportTypeSort}>
                        {[
                            "All",
                            "Over speeding",
                            "Over Pricing",
                            "Harassment",
                            "Reckless Driving",
                            "Verbal Abuse",
                            "Physical Abuse",
                            "Overloading",
                            "Others..."].map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                            ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search by Report ID"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-2 px-2 rounded-lg"
                    />
                </div>
                <div className="p-4">
                    {renderReports()}
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
