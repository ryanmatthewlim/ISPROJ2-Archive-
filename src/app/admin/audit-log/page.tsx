import {Table, TableHeader} from '@/components/table/Table';
import {Button} from '@/components/Button';
import React from 'react';

const columns = ["Administrator Name", "Action/s", "Date"];
const people = [
  { AdministratorName: 'bruh Walton', Action: 'Front-end Developer', Date: 'lindsay.walton@example.com' },
  { AdministratorName: 'bruh', Action:'ginormous godzilla', Date:'inormous godzilla'},
  // More people...
];

export default function Auditlog() {
    return (
        <>
        <div className="sm:flex sm:items-center py-9">
        <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
            Audit Log
            </h1>
        </div>
        </div>

            <Table columnNames={columns} tableRows={people}/>
            <p>button here at end of each</p>
        </>
        
    )
}