'use client'

import { useState } from "react";

export default function SearchBar() {

    const [orgao, setOrgao] = useState("");

    return (
        <div id='filter' className="container mx-auto py-4">
            <div className="flex gap-4 mb-4">
                    <select 
                        id="orgao"
                        value={orgao}
                        onChange={(e) => {
                            setOrgao(e.target.value);
                        }}
                        className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                            <option value="">Órgão</option>
                            <option value="STF">STF</option>
                            <option value="STJ">STJ</option>
                    </select>
            </div>
            <p>{orgao}</p>
        </div>
    )
}