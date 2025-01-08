import React from 'react'
import Breadcrumb from '../shared/BreadCrumb'

const PageContainer: React.FC<{ children: React.ReactNode, breadcrumbs?: { text: string, url: string }[] }> = ({ children, breadcrumbs }) => {

    return (
        <div className='container px-6 mx-auto mb-4'>
            {breadcrumbs ?
                <div className='font-semibold text-gray-900 '>
                    <Breadcrumb breadcrumbs={breadcrumbs} />
                </div> : <></>}
            {children}

        </div>
    )
}

export default PageContainer