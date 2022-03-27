import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [pins, setPins] = useState();
  const [pinsEmpty,setPinsEmpty]=useState('');
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
        client.fetch(query).then((data) => {
          console.log(data)
          if(data.length>0){
            setPins(data);
            setLoading(false);
          }
          else{
            setPins(data);
            setLoading(false);
            setPinsEmpty('There is no Photos in this Catagory')
          }
          
        });
       } 
    else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);
  const ideaName = categoryId || 'new';
  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }
  return (
    <div>
      
        {
          pins?.length>0?(<MasonryLayout pins={pins} />):(<div className="flex flex-row justify-center mt-40 italic md:text-3xl text-red-500">{pinsEmpty}</div>)
         }
      
    </div>
  );
};

export default Feed;
