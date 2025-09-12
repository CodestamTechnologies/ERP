/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";

import { motion } from 'framer-motion';
import { AgreementData, } from '@/types/letterofIntent';
import { useRef } from "react";
const PreviewSection = ({ title, children, show = true }: { title: string; children: React.ReactNode; show?: boolean }) =>
    show ? (
        <div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            {children}
        </div>
    ) : null;
// LOIPreviewPage Component
export const LOIPreviewPage = ({
    data,
}: {
    data: AgreementData;
}) => {
    const previewRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-7xl mx-auto p-6">


            <motion.div ref={previewRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">LETTER OF INTENT</h1>
                        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                    </div>
                    <div className="text-right mb-6">
                        <p className="text-gray-600">Date: {formatDate(data.loi.date)}</p>
                    </div>
                    <div className="mb-6">
                        <div className="font-semibold text-lg">{data.sender.company}</div>
                        <div className="text-gray-700">
                            {data.sender.address}<br />
                            {data.sender.city}, {data.sender.state} {data.sender.zip}<br />
                            Phone: {data.sender.phone}<br />
                            Email: {data.sender.email}
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="font-semibold">To:</div>
                        <div className="text-gray-700">
                            {data.recipient.name}, {data.recipient.title}<br />
                            {data.recipient.company}<br />
                            {data.recipient.address}<br />
                            {data.recipient.city}, {data.recipient.state} {data.recipient.zip}
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="font-semibold">Subject: {data.loi.subject}</div>
                    </div>
                    <div className="mb-6 space-y-4 text-gray-800 leading-relaxed">
                        <p>Dear {data.recipient.name},</p>
                        <p>
                            This Letter of Intent LOI&quot; serves to express {data.sender.company}&apos;s serious interest in
                            establishing a business relationship with {data.recipient.company} regarding the following opportunity:
                        </p>
                        {[
                            { title: 'Project Description:', content: data.loi.projectDescription },
                            { title: 'Proposed Terms:', content: data.loi.proposedTerms },
                            { title: 'Proposed Timeline:', content: data.loi.timeline },
                            { title: 'Budget Consideration:', content: data.loi.budget },
                            { title: 'Next Steps:', content: data.loi.nextSteps },
                        ].map(section => (
                            <PreviewSection key={section.title} title={section.title} show={!!section.content}>
                                <p className="whitespace-pre-wrap">{section.content}</p>
                            </PreviewSection>
                        ))}
                        <p>
                            This Letter of Intent is non-binding and serves as a preliminary expression of interest.
                            It is valid for {data.loi.validityPeriod} from the date above, after which it will expire
                            unless renewed or superseded by a formal agreement.
                        </p>
                        <p>
                            We look forward to discussing this opportunity further and working together to develop
                            a mutually beneficial partnership.
                        </p>
                        <p>Sincerely,</p>
                    </div>
                    <div className="mt-12">
                        <div className="border-b border-gray-400 w-64 mb-2"></div>
                        <div className="font-semibold">{data.loi.signerName}</div>
                        <div className="text-gray-700">{data.loi.signerTitle}</div>
                        <div className="text-gray-700">{data.sender.company}</div>
                        <div className="text-gray-600 text-sm mt-2">
                            Date: {formatDate(data.loi.signerDate)}
                        </div>
                    </div>
                    <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
                        <p>This Letter of Intent is confidential and proprietary to {data.sender.company}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
