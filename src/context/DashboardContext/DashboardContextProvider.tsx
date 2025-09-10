"use client";
import React, { createContext, useContext, ReactNode, useMemo, useState, JSX } from "react";
import {
    STATS,
    RECENT_ACTIVITIES,
    AI_INSIGHTS,
    INVENTORY_STATUS,
    QUICK_ACTIONS,
} from "@/lib/components-Data/dashboard/constent";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { DashboardReport } from "./Report";

export type TimeRange = "7days" | "30days" | "90days" | "1year";

interface DashboardContextProps {
    selectedTimeRange: TimeRange;
    setSelectedTimeRange: (range: TimeRange) => void;
    isGeneratingReport: boolean;
    isLoading: boolean;
    stats: typeof STATS;
    activities: typeof RECENT_ACTIVITIES;
    insights: typeof AI_INSIGHTS;
    inventory: typeof INVENTORY_STATUS;
    quickActions: typeof QUICK_ACTIONS;
    handleGenerateReport: () => void;
    generateReportContent: () => JSX.Element;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("90days");
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsGeneratingReport(false);
    };

    // 🔎 Filter helper
    const filterDataByTimeRange = <T extends { date?: string }>(data: T[]): T[] => {
        if (!data || data.length === 0) return [];
        const now = new Date();
        let cutoff: Date;
        switch (selectedTimeRange) {
            case "7days": cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
            case "30days": cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
            case "90days": cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
            case "1year": cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
            default: cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        return data.filter((item) => !item.date || new Date(item.date) >= cutoff);
    };

    const stats = useMemo(() => filterDataByTimeRange(STATS), [selectedTimeRange]);
    const activities = useMemo(() => filterDataByTimeRange(RECENT_ACTIVITIES), [selectedTimeRange]);
    const insights = useMemo(() => filterDataByTimeRange(AI_INSIGHTS), [selectedTimeRange]);
    const inventory = useMemo(() => filterDataByTimeRange(INVENTORY_STATUS), [selectedTimeRange]);
    const quickActions = useMemo(() => filterDataByTimeRange(QUICK_ACTIONS), [selectedTimeRange]);

    // ✅ Styled report generator with PDF export
    const generateReportContent = (): JSX.Element => {
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
              <DashboardReport/>
        );
    };

    return (
        <DashboardContext.Provider
            value={{
                selectedTimeRange,
                setSelectedTimeRange,
                isGeneratingReport,
                isLoading,
                stats,
                activities,
                insights,
                inventory,
                quickActions,
                handleGenerateReport,
                generateReportContent,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboardContext must be used within a DashboardProvider");
    return context;
};
