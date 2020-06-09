import React, {useEffect, useState} from 'react';
import Card from '../card/Card';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';


export default function GraphHome(){

    let query = gql`
        {
            characters{
                results{
                    name
                    image
                }
            }
        }
    `;

    let result = useQuery(query);
    console.log(result);

    return (
        <Card 
            // leftClick={nextCharacter}  
            // rightClick={addFav}  
            // {...char}
        />
    );
}