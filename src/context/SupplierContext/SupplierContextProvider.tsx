'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Supplier } from '@/types/supplier';
import { SUPPLIERS, SUPPLIER_STATS, SUPPLIER_CATEGORIES, RECENT_ACTIVITIES, QUICK_ACTIONS } from '@/lib/components-Data/supplier/constent';

interface SupplierContextType {
    suppliers: Supplier[];
    filteredSuppliers: Supplier[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    viewMode: 'table' | 'cards';
    setViewMode: (mode: 'table' | 'cards') => void;
    isLoading: boolean;
    isExporting: boolean;
    handleExport: () => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    dialogMode: 'add' | 'edit' | 'view';
    setDialogMode: (mode: 'add' | 'edit' | 'view') => void;
    selectedSupplier: Supplier | null;
    setSelectedSupplier: (supplier: Supplier | null) => void;
    handleSaveSupplier: (supplierData: Partial<Supplier>) => void;
    SUPPLIER_STATS: typeof SUPPLIER_STATS;
    SUPPLIER_CATEGORIES: typeof SUPPLIER_CATEGORIES;
    RECENT_ACTIVITIES: typeof RECENT_ACTIVITIES;
    QUICK_ACTIONS: typeof QUICK_ACTIONS;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleExport = () => {
        if (!suppliers || suppliers.length === 0) return;

        setIsExporting(true);

        // Use full suppliers array (ignore filtering)
        const allSuppliers = suppliers; // full data

        // Create CSV headers
        const headers = [
            "ID", "Name", "Contact Person", "Email", "Number", "Company",
            "Location", "Category", "Capacity", "Active Hours", "Market",
            "Total Orders", "Total Paid", "Pending Amount", "Rating", "Join Date", "Last Order"
        ];

        // Convert all suppliers to CSV rows
        const rows = allSuppliers.map(supplier => [
            supplier.id,
            supplier.name,
            supplier.contactPerson,
            supplier.email,
            supplier.number,
            supplier.company,
            supplier.location,
            supplier.category,
            supplier.capacity,
            supplier.activeHours,
            supplier.market,
            supplier.totalOrders,
            supplier.totalPaid,
            supplier.pendingAmount,
            supplier.rating,
            supplier.joinDate,
            supplier.lastOrder
        ]);

        const csvContent = [headers, ...rows]
            .map(e => e.map(v => `"${v ?? ""}"`).join(","))
            .join("\n");

        // Create a blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `all_suppliers_export_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => setIsExporting(false), 1000);
    };


    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            supplier.category.toLowerCase().replace(' ', '-') === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
        if (dialogMode === 'add') {
            const newSupplier: Supplier = {
                ...supplierData as Supplier,
                id: Date.now().toString(),
                totalOrders: 0,
                totalPaid: 0,
                pendingAmount: 0,
                lastOrder: new Date().toISOString().split('T')[0],
                joinDate: new Date().toISOString().split('T')[0],
                rating: 0
            };
            setSuppliers(prev => [...prev, newSupplier]);
        } else if (dialogMode === 'edit' && selectedSupplier) {
            setSuppliers(prev => prev.map(supplier =>
                supplier.id === selectedSupplier.id ? { ...supplier, ...supplierData } : supplier
            ));
        }
    };

    return (
        <SupplierContext.Provider value={{
            suppliers,
            filteredSuppliers,
            searchTerm,
            setSearchTerm,
            selectedCategory,
            setSelectedCategory,
            sortBy,
            setSortBy,
            viewMode,
            setViewMode,
            isLoading,
            isExporting,
            handleExport,
            dialogOpen,
            setDialogOpen,
            dialogMode,
            setDialogMode,
            selectedSupplier,
            setSelectedSupplier,
            handleSaveSupplier,
            SUPPLIER_STATS,
            SUPPLIER_CATEGORIES,
            RECENT_ACTIVITIES,
            QUICK_ACTIONS
        }}>
            {children}
        </SupplierContext.Provider>
    );
};

export const useSupplierContext = () => {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error('useSupplierContext must be used within a SupplierProvider');
    }
    return context;
};
