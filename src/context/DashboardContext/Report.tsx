"use client";
import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "./DashboardContextProvider";

export const DashboardReport = () => {
    const { stats, activities, insights, inventory, selectedTimeRange } =
        useDashboardContext();

    const exportToPDF = async () => {
        const input = document.getElementById("dashboard-report");
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Dashboard_Report_${selectedTimeRange}.pdf`);
    };

    return (
        <div
            id="dashboard-report"
            className="p-8 w-full bg-white text-gray-900 rounded-lg "
        >
            {/* Header */}
            <div className="border-b pb-4 mb-6 flex  justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Sales Dashboard Report
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-600 mt-2">
                        Period: {selectedTimeRange}
                    </h2>
                </div>
                <Button
                    onClick={exportToPDF}
                    className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                    Export to PDF
                </Button>
            </div>

            {/* Stats Section */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    📊 Key Performance Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats.map((s, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-gray-50 rounded-md border border-gray-200"
                        >
                            <span className="font-medium text-gray-800">{s.name}</span>:{" "}
                            {s.value}{" "}
                            <span className="text-sm text-gray-500">({s.change})</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Activities Section */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    📝 Recent Activities
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((a) => (
                        <li
                            key={a.id}
                            className="p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                            <span className="text-gray-800">{a.message}</span>
                            <span className="block text-sm text-gray-500 mt-1">
                                {new Date(a.date!).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Insights Section */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    🤖 AI-Powered Insights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {insights.map((i, idx) => (
                        <li
                            key={idx}
                            className="p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                            <span className="font-medium text-gray-800">{i.title}</span>:{" "}
                            {i.description}{" "}
                            <span className="text-sm text-gray-500">
                                (Confidence {i.confidence}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Inventory Section */}
            <section>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    📦 Inventory Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {inventory.map((inv, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-gray-50 rounded-md border border-gray-200"
                        >
                            <span className="font-medium text-gray-800">{inv.label}</span>:{" "}
                            {inv.count}{" "}
                            <span className="text-sm text-gray-500">({inv.color})</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
