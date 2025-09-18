// import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorage } from 'react-native';

export const storeData = async (key, value) => {
    try{
        await AsyncStorage.setItem(key, value);
    }catch(error){
        console.log('Error storing value', error);
    }
};


export const getData = async (key) => {
    try{
        const value = await AsyncStorage.getItem(key);
        return value
    }catch(error){
        console.log('Error gettting value', error);
    }
};