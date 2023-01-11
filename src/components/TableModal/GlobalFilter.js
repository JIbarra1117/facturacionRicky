import React, { Component } from 'react'

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Buscar</span>
                </div>
                <input type="text" className="form-control" placeholder="Ingresar el dato" aria-label="Ingresar el dato" aria-describedby="basic-addon1"
                    value={filter || ''}
                    onChange={e => setFilter(e.target.value.includes("/")?e.target.value.split('/').join('-'):e.target.value)} />
            </div>
        </>
    )

}
