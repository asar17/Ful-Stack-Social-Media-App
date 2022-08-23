import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  const [pins, setPins] = useState();
  const [pinsEmpty,setPinsEmpty]=useState('');
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const [savingPost, setSavingPost] = useState(false);
  const [saved,setSaved]=useState(false);

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
    return () => { };

  }, [categoryId]);

  //save pin
let alreadySaved = pins?.save?.filter((item) => item?.postedBy?._id === user?.googleId);
alreadySaved = alreadySaved?.length > 0 ? alreadySaved: [] ;

const savePin =(id)=>{
  if (alreadySaved?.length === 0) {
    setSavingPost(true);

    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [{
        _key: uuidv4(),
        userId: user?.googleId,
        postedBy: {
          _type: 'postedBy',
          _ref: user?.googleId,
        },
      }])
      .commit()
      .then(() => {
        //window.location.reload();
        setSavingPost(false)
        setSaved(true)
        //console.log(pins)
        //console.log(saved)
        console.log(`pins is :${pins?.save?.length}`)
        //setLoading(false);
      });
  }
}
  const ideaName = categoryId || 'new';
  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }
  return (
    <div>
      
        {
          pins?.length>0?(<MasonryLayout pins={pins} savePin={savePin} saveingPost={savingPost} saved={saved} alreadySaved={alreadySaved}/>):(<div className="flex flex-row justify-center mt-40 italic md:text-3xl text-red-500">{pinsEmpty}</div>)
         }
      
    </div>
  );
};

export default Feed;
