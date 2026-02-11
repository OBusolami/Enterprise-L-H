import React, { useState } from 'react';
import ResourceForm from '../components/resources/ResourceForm';
import BulkResourceForm from '../components/resources/BulkResourceForm';
import { PlusCircle, ListPlus } from 'lucide-react';

const SubmitResource = () => {
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Share Resources</h1>
                <p className="text-gray-600 mt-2">Help the team by sharing valuable learning content.</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setMode('single')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition-all ${mode === 'single'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="font-medium">Single Resource</span>
                </button>
                <button
                    onClick={() => setMode('bulk')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition-all ${mode === 'bulk'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                >
                    <ListPlus className="w-4 h-4" />
                    <span className="font-medium">Bulk Upload (URLs)</span>
                </button>
            </div>

            <div className="transition-all duration-300">
                {mode === 'single' ? <ResourceForm /> : <BulkResourceForm />}
            </div>
        </div>
    );
};

export default SubmitResource;
