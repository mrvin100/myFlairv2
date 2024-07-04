'use client'
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import "quill-paste-smart"
import 'react-quill/dist/quill.snow.css';
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, SelectLabel, 
    SelectTrigger, SelectValue 
} from '@/components/ui/select';

const getAndEditAdditionalService = () => {
    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Modification des Services Additionels</h2>
            </div>
            <div style={{ margin: '0 auto' }} className="flex flex-col justify-center items-center">
                <form style={{ margin: '3%' }}>
                    <div>
                        <label>Titre</label>
                        <Input
                            type="text"
                            // value={title}
                            // onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <br />
                    <div>
                        <label>Description</label>
                        <br />
                        <ReactQuill
                            // value={description}
                            // onChange={(value) => setDescription(value)}
                            placeholder="Rédigez votre description..."
                        />
                    </div>
                    <br />
                    <div>
                        <label>Prix</label>
                        <Input
                            type="number"
                            // value={post.weekPrice}
                            // onChange={(e) => setWeekPrice(parseInt(e.target.value))}
                        />
                    </div>
<br />
                      <label>Type de location</label>
                      <br />

                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup >
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="day">par Jour</SelectItem>
                            <SelectItem value="piece">par Pièce</SelectItem>
                            <SelectItem value="page">par Page</SelectItem>   
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <br />
                    <div>
                        <label>Stock</label>
                        <Input
                            type="number"
                            // value={stock}
                            // onChange={(e) => setStock(parseInt(e.target.value))}
                        />
                    </div>
                    <br />
                    <br />
                    <Button type="submit">Enregistrer les modifications</Button>
                </form>
            </div>
        </div>
    );
};

export default getAndEditAdditionalService;
