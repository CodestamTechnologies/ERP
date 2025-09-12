'use client'; // if using Next.js app directory

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PartnerInfo } from '@/types/partnership';
import { FormField } from '../BaseDocumentComponent';

interface PartnerFormProps {
  partner: PartnerInfo;
  onChange: (field: keyof PartnerInfo, value: string) => void;
  title: string;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onChange, title }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField
        label="Organization/Individual Name"
        id={`${title}-name`}
        value={partner.name}
        onChange={(v) => onChange('name', v)}
        placeholder="Partner name"
      />
      <FormField
        label="Address"
        id={`${title}-address`}
        value={partner.address}
        onChange={(v) => onChange('address', v)}
        placeholder="Street address"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" id={`${title}-city`} value={partner.city} onChange={(v) => onChange('city', v)} placeholder="City" />
        <FormField label="State" id={`${title}-state`} value={partner.state} onChange={(v) => onChange('state', v)} placeholder="State" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="ZIP Code" id={`${title}-zip`} value={partner.zip} onChange={(v) => onChange('zip', v)} placeholder="ZIP code" />
        <FormField label="Phone" id={`${title}-phone`} value={partner.phone} onChange={(v) => onChange('phone', v)} placeholder="Phone number" />
      </div>

      <FormField
        label="Email"
        id={`${title}-email`}
        type="email"
        value={partner.email}
        onChange={(v) => onChange('email', v)}
        placeholder="Email address"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Representative Name" id={`${title}-rep`} value={partner.representative} onChange={(v) => onChange('representative', v)} placeholder="Representative name" />
        <FormField label="Title" id={`${title}-title`} value={partner.title} onChange={(v) => onChange('title', v)} placeholder="Job title" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Capital Contribution" id={`${title}-contribution`} value={partner.contribution} onChange={(v) => onChange('contribution', v)} placeholder="₹ 10,00,000" />
        <FormField label="Ownership %" id={`${title}-ownership`} value={partner.ownershipPercentage} onChange={(v) => onChange('ownershipPercentage', v)} placeholder="50" />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Signature Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Signer Name" id={`${title}-signer-name`} value={partner.signerName} onChange={(v) => onChange('signerName', v)} placeholder="Full name" />
          <FormField label="Signer Title" id={`${title}-signer-title`} value={partner.signerTitle} onChange={(v) => onChange('signerTitle', v)} placeholder="Job title" />
        </div>
        <FormField
          label="Signature Date"
          id={`${title}-signer-date`}
          type="date"
          value={partner.signerDate}
          onChange={(v) => onChange('signerDate', v)}
        />
      </div>
    </CardContent>
  </Card>
);

export default PartnerForm;
