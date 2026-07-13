import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Input } from '../components/Input';

interface LogMaterialFormProps {
  onSuccess?: () => void;
}

const LogMaterialForm = ({ onSuccess }: LogMaterialFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    material_id: '',
    change_amount: '',
    transaction_type: 'INCOMING',
    facility_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [materials, setMaterials] = useState<{ value: string; label: string }[]>([]);
  const [facilities, setFacilities] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [matsRes, facsRes] = await Promise.all([
          api.get('/inventory/materials'),
          // Assuming there's a facility endpoint or hardcoding for now if not exists
          Promise.resolve({ data: [
            { value: 'fac-1', label: 'City MRF' },
            { value: 'fac-2', label: 'Westside MRF' }
          ]})
        ]);
        
        // Map material data to select options
        setMaterials(matsRes.data.map((m: any) => ({ 
          value: m.id, 
          label: m.name 
        })));
        setFacilities(facsRes.data);
      } catch (err) {
        console.error('Error fetching lookups', err);
      }
    };
    fetchLookups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        change_amount: parseFloat(formData.change_amount),
      };

      if (!payload.material_id || !payload.facility_id) {
        throw new Error('Please select both a material and a facility.');
      }

      const response = await api.post('/inventory/log-material', payload);

      if (response.status === 201 || response.status === 200) {
        alert('Material entry logged successfully!');
        if (onSuccess) onSuccess();
        setFormData({
          material_id: '',
          change_amount: '',
          transaction_type: 'INCOMING',
          facility_id: '',
        });
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrors({ 
        form: err.response?.data?.error || err.message || 'Failed to log material. Please check your inputs.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Log Material Entry" subtitle="Record new material movements">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Select 
            label="Material"
            value={formData.material_id}
            onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
            options={materials.length > 0 ? materials : [{ value: '', label: 'Loading...' }]}
            required
          />
        </div>

        <div className="space-y-1">
          <Select
            label="Transaction Type"
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
            options={[
              { value: 'INCOMING', label: 'Incoming (Stock +)' },
              { value: 'OUTGOING', label: 'Outgoing (Stock -)' },
              { value: 'ADJUSTMENT', label: 'Adjustment (Set to Value)' },
            ]}
          />
        </div>

        <div className="space-y-1">
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.change_amount}
            onChange={(e) => setFormData({ ...formData, change_amount: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Select
            label="Facility"
            value={formData.facility_id}
            onChange={(e) => setFormData({ ...formData, facility_id: e.target.value })}
            options={facilities}
            required
          />
        </div>

        {errors.form && <p className="text-sm text-red-600 font-medium">{errors.form}</p>}

        <div className="pt-2">
          <Button type="submit" className="w-full" loading={loading}>
            Submit Entry
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LogMaterialForm;
