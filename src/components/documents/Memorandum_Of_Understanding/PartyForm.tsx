
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyInfo } from '@/types/memorandomOFUnderstanding';
import { FormField } from './FormFiels';
export const PartyForm = ({ party, onChange, title }: {
    party: PartyInfo;
    onChange: (field: keyof PartyInfo, value: string) => void;
    title: string;
}) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <FormField label="Organization Name" id={`${title}-name`} value={party.name} onChange={(v) => onChange('name', v)} placeholder="Organization name" />
            <FormField label="Address" id={`${title}-address`} value={party.address} onChange={(v) => onChange('address', v)} placeholder="Street address" />

            <div className="grid grid-cols-2 gap-4">
                <FormField label="City" id={`${title}-city`} value={party.city} onChange={(v) => onChange('city', v)} placeholder="City" />
                <FormField label="State" id={`${title}-state`} value={party.state} onChange={(v) => onChange('state', v)} placeholder="State" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="ZIP Code" id={`${title}-zip`} value={party.zip} onChange={(v) => onChange('zip', v)} placeholder="ZIP code" />
                <FormField label="Phone" id={`${title}-phone`} value={party.phone} onChange={(v) => onChange('phone', v)} placeholder="Phone number" />
            </div>

            <FormField label="Email" id={`${title}-email`} type="email" value={party.email} onChange={(v) => onChange('email', v)} placeholder="Email address" />

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Representative Name" id={`${title}-rep`} value={party.representative} onChange={(v) => onChange('representative', v)} placeholder="Representative name" />
                <FormField label="Title" id={`${title}-title`} value={party.title} onChange={(v) => onChange('title', v)} placeholder="Job title" />
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Signature Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Signer Name" id={`${title}-signer-name`} value={party.signerName} onChange={(v) => onChange('signerName', v)} placeholder="Full name" />
                    <FormField label="Signer Title" id={`${title}-signer-title`} value={party.signerTitle} onChange={(v) => onChange('signerTitle', v)} placeholder="Job title" />
                </div>
                <FormField label="Signature Date" id={`${title}-signer-date`} type="date" value={party.signerDate} onChange={(v) => onChange('signerDate', v)} />
            </div>
        </CardContent>
    </Card>
);