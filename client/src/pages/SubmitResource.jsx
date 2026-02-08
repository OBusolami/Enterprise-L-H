import React from 'react';
import ResourceForm from '../components/resources/ResourceForm';

const SubmitResource = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Share Resource</h1>
                <p className="text-gray-600 mt-2">Help the team by sharing a valuable learning resource.</p>
            </div>

            <ResourceForm />
        </div>
    );
};

export default SubmitResource;
