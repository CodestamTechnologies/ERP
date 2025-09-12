'use client'; // if using Next.js 13+ app directory

import React from 'react';
import { PartnerInfo, AgreementData } from '@/types/partnership';

interface PartnerPreviewProps {
    partner: PartnerInfo;
    title: string;
}

const PartnerPreview: React.FC<PartnerPreviewProps> = ({ partner, title }) => (
    <div className="border border-gray-300 p-4 rounded">
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <div className="text-gray-700">
            <div className="font-semibold">{partner.name}</div>
            <div>{partner.address}</div>
            <div>
                {partner.city}, {partner.state} {partner.zip}
            </div>
            <div>Phone: {partner.phone}</div>
            <div>Email: {partner.email}</div>
            {partner.representative && (
                <div className="mt-2">
                    <div className="font-medium">Represented by:</div>
                    <div>
                        {partner.representative}, {partner.title}
                    </div>
                </div>
            )}
            <div className="mt-2">
                <div className="font-medium">Ownership: {partner.ownershipPercentage}%</div>
            </div>
        </div>
    </div>
);

interface PreviewSectionProps {
    title: string;
    children: React.ReactNode;
    show?: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ title, children, show = true }) =>
    show ? (
        <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            {children}
        </div>
    ) : null;

// Helper function to format dates
const formatDate = (date: string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

interface SignatureBlockProps {
    partner: PartnerInfo;
    title: string;
}

const SignatureBlock: React.FC<SignatureBlockProps> = ({ partner, title }) => (
    <div>
        <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
        <div className="border-b border-gray-400 w-64 mb-2"></div>
        <div className="font-semibold">{partner.signerName}</div>
        <div className="text-gray-700">{partner.signerTitle}</div>
        <div className="text-gray-700">{partner.name}</div>
        <div className="text-gray-600 text-sm mt-2">
            Date: {formatDate(partner.signerDate)}
        </div>
    </div>
);

interface AgreementPreviewProps {
    data: AgreementData;
}

const AgreementPreview: React.FC<AgreementPreviewProps> = ({ data }) => (
    <div
        className="bg-white p-8 shadow-lg max-w-4xl mx-auto"
        style={{ fontFamily: 'Times New Roman, serif' }}
    >
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">PARTNERSHIP AGREEMENT</h1>
            <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
            {data.partnership.partnershipName && (
                <h2 className="text-lg font-semibold mt-4 text-gray-700">
                    {data.partnership.partnershipName}
                </h2>
            )}
        </div>

        {/* Date */}
        <div className="text-right mb-6">
            <p className="text-gray-600">Date: {formatDate(data.partnership.date)}</p>
        </div>

        {/* Body */}
        <div className="mb-6 space-y-6 text-gray-800 leading-relaxed">
            <p>
                This Partnership Agreement is entered into on{' '}
                {formatDate(data.partnership.effectiveDate)} between the following parties:
            </p>

            {/* Partners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PartnerPreview partner={data.partner1} title="PARTNER 1" />
                <PartnerPreview partner={data.partner2} title="PARTNER 2" />
            </div>

            {/* Sections */}
            <PreviewSection title="1. PARTNERSHIP FORMATION">
                <p>
                    The parties hereby agree to form a {data.partnership.partnershipType} under the name{' '}
                    {data.partnership.partnershipName} for the purpose of {data.partnership.businessPurpose}.
                </p>
                {data.partnership.businessAddress && (
                    <p className="mt-2">
                        The principal place of business shall be located at {data.partnership.businessAddress},{' '}
                        {data.partnership.businessCity}, {data.partnership.businessState}{' '}
                        {data.partnership.businessZip}.
                    </p>
                )}
            </PreviewSection>

            <PreviewSection title="2. TERM OF PARTNERSHIP">
                <p>
                    This partnership shall commence on {formatDate(data.partnership.effectiveDate)} and shall
                    continue for {data.partnership.duration.toLowerCase()}, unless terminated earlier in
                    accordance with the terms herein.
                </p>
            </PreviewSection>

            <PreviewSection
                title="3. CAPITAL CONTRIBUTIONS"
                show={!!(data.partnership.initialCapital || data.partnership.capitalContributions)}
            >
                {data.partnership.initialCapital && (
                    <p>The initial capital of the partnership shall be {data.partnership.initialCapital}.</p>
                )}
                {data.partnership.capitalContributions && (
                    <p className="whitespace-pre-wrap mt-2">{data.partnership.capitalContributions}</p>
                )}
            </PreviewSection>

            <PreviewSection title="4. PROFIT AND LOSS SHARING">
                <p>
                    Profits shall be shared in the ratio of {data.partnership.profitSharingRatio} and losses
                    shall be shared in the ratio of {data.partnership.lossSharingRatio} between the partners.
                </p>
                {data.partnership.drawingLimits && <p className="mt-2">Drawing limits: {data.partnership.drawingLimits}</p>}
            </PreviewSection>

            {/* Remaining Sections */}
            {[
                { title: '5. MANAGEMENT STRUCTURE', content: data.partnership.managementStructure },
                { title: '6. DECISION MAKING', content: data.partnership.decisionMaking },
                { title: '7. ROLES AND RESPONSIBILITIES', content: data.partnership.rolesResponsibilities },
                { title: '8. MEETINGS', content: data.partnership.meetingRequirements },
                { title: '9. TERMINATION', content: data.partnership.terminationClause },
                { title: '10. NON-COMPETE CLAUSE', content: data.partnership.nonCompeteClause },
                { title: '11. CONFIDENTIALITY', content: data.partnership.confidentialityClause },
                { title: '12. DISPUTE RESOLUTION', content: data.partnership.disputeResolution },
            ].map((section) => (
                <PreviewSection key={section.title} title={section.title} show={!!section.content}>
                    <p className="whitespace-pre-wrap">{section.content}</p>
                </PreviewSection>
            ))}

            <PreviewSection title="13. GOVERNING LAW">
                <p>This Agreement shall be governed by and construed in accordance with the {data.partnership.governingLaw}.</p>
            </PreviewSection>

            <PreviewSection title="14. AMENDMENTS" show={!!data.partnership.amendments}>
                <p className="whitespace-pre-wrap">{data.partnership.amendments}</p>
            </PreviewSection>

            <PreviewSection title="15. GENERAL PROVISIONS">
                <p>
                    This Agreement constitutes the entire agreement between the parties and supersedes all prior
                    negotiations, representations, or agreements relating to the subject matter herein.
                </p>
            </PreviewSection>
        </div>

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <SignatureBlock partner={data.partner1} title="PARTNER 1" />
            <SignatureBlock partner={data.partner2} title="PARTNER 2" />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>This Partnership Agreement is confidential and proprietary</p>
        </div>
    </div>
);

export default AgreementPreview;
