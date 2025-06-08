import React, { useState } from 'react';

interface FundraiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FundraiseFormData) => Promise<void>;
  isLoading: boolean;
}

export interface FundraiseFormData {
  title: string;
  email: string;
  name: string;
  type: 'Campaign' | 'Request';
  endDate: string;
  amount: number;
  description: string;
  driveLink: string;
}

export const FundraiseModal: React.FC<FundraiseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<FundraiseFormData>({
    title: '',
    email: '',
    name: '',
    type: 'Campaign',
    endDate: '',
    amount: 0,
    description: '',
    driveLink: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTypeChange = (type: 'Campaign' | 'Request') => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.email || !formData.name || !formData.description || !formData.driveLink) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (formData.type === 'Campaign' && !formData.endDate) {
      alert('End date is required for campaigns');
      return;
    }

    await onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      email: '',
      name: '',
      type: 'Campaign',
      endDate: '',
      amount: 0,
      description: '',
      driveLink: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Start a Fundraise</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-6">
          All the Campaigns and Requests need to be approved from the DAO before they are live
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter Title For Your Fundraise"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select the type of Fundraise
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === 'Campaign'}
                  onChange={() => handleTypeChange('Campaign')}
                  className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Campaign</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === 'Request'}
                  onChange={() => handleTypeChange('Request')}
                  className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Request</span>
              </label>
            </div>
          </div>

          {/* End Date (only for Campaign) */}
          {formData.type === 'Campaign' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EndDate
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required={formData.type === 'Campaign'}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please enter your story here"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Drive Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drive Link
            </label>
            <input
              type="url"
              name="driveLink"
              value={formData.driveLink}
              onChange={handleInputChange}
              placeholder="Please enter the drive link of all the documents"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Request...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}; 