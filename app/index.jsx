import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CalendarDaysIcon, MagnifyingGlassIcon , XMarkIcon} from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {debounce} from 'lodash'
import {theme} from './utils/themes'
import {fetchWeatherForecast, fetchLocation} from './api/weather'
import { weatherImages } from "./utils/constants";
import * as Progress from 'react-native-progress';
import {storeData, getData} from './utils/asyncStorage'
import { StatusBar } from 'expo-status-bar';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const[showSearch, setShowSearch] = useState(false)
  const[locations, setLocations] = useState([])
  const[weather, setWeather] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const condition = current?.condition?.text
  const imageSource = weatherImages[condition] || weatherImages["other"];

  const handleLocation = (loc) =>{
    setLocations([]);
    setShowSearch(false)
    setIsLoading(true)
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7
    }).then(data => {
      console.log("data", data);
      setWeather(data);
      setIsLoading(false)
      storeData('city', loc.name)
    })
  }

  const handleSearch = (value) => {
    //Fetch location
    if(value.length>2){
      fetchLocation({cityName: value}).then(
        data=>{
          setLocations(data)
        }
      )
    }
  }

  useEffect(() => {
    fetchMyWeatherForecast();
  }, []);

  const fetchMyWeatherForecast = async () => {
    let myCity = await getData('city')
    let cityName = 'Noida'

    if(myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName,
      days: 7
    }).then(data => {
      setWeather(data);
      setIsLoading(false)
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 200), [])

  const {current, location} = weather;


  return (
    <View
      style={{ marginTop: insets.top, marginBottom: insets.bottom }}
      className="flex-1 relative"
    >

      <StatusBar style="dark" backgroundColor="#1E90FF"/>
      <Image
        className="absolute w-full h-full"
        blurRadius={70}
        source={{
          uri: "https://images.pexels.com/photos/746681/pexels-photo-746681.jpeg",
        }}
      />
    
    {/* Show loading screen */}
    {
      isLoading? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={5} size={100} color={"white"}/>
        </View>
      ): (
      <View className="flex flex-1">
      {/* search section */}
      <View style={{ height: "7%" }} className="mx-4 mt-4 relative z-50">
        <View className={`flex-row justify-end items-center  ${showSearch? "bg-white-45 rounded-full" : "bg-transparent"}`}>
          {
            showSearch? (
            <TextInput 
            placeholder="Search City" 
            placeholderTextColor={"white"}
            cursorColor={"white"}
            onChangeText={handleTextDebounce}
            className="pl-4 h-10 pb-2 flex-1 text-xl text-white"
            />
            ): null
          }
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={1}
            className="rounded-full p-3 m-1"
            style={{backgroundColor: theme.bgWhite(0.3)}}
          >
            {
              showSearch? <XMarkIcon size={18} color={"white"}/>:
              <MagnifyingGlassIcon size={"18"} color={"white"}/>
            }
          </TouchableOpacity>
        </View>
        {
          locations.length > 0 && showSearch?(
            <View className="absloute w-full bg-gray-300 top-3 rounded-3xl">
              {
                locations.map((loc, index) => {
                  let showBorder = index+1 != locations.length;
                  let bordeClass = showBorder? 'border-b-2 border-b-gray-400' : '';
                  return(
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={"flex-row items-center border-0 p-3 px-4 mb-1 " + bordeClass}
                    >
                      <MapPinIcon size={20} color={'gray'}/>
                      <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          ): null
        }
      </View>

      {/* Forecast Section */}
      <View className="mx-4 flex justify-around flex-1 mb-2">

        {/* location */}
        <Text className="text-white text-center text-4xl font-bold">
          {location?.name}
          <Text className="text-2xl font-semibold text-gray-300">
            {", " +location?.country}
          </Text>
        </Text>

        {/* Weather Image */}
        <View className="flex-row justify-center">
          <Image
            source={imageSource}
            className="w-52 h-52"
          />
        </View>

        {/* Degree Celcius */}
        <View className="space-y-2">
          <Text className="text-center font-bold text-white text-6xl ml-5">
            {current?.temp_c}&#176;
          </Text>
          <Text className="text-center text-white text-xl font-semibold tracking-widest">
            {current?.condition?.text}
          </Text>
        </View>

        {/* Other States */}
        <View className="flex-row justify-between mx-4">
          <View className="flex-row space-x-2 items-center">
            <Image source={require('../assets/images/wind.png')} className="h-6 w-6"/>
            <Text className="text-white ml-1 font-semibold text-base">
              {current?.wind_kph}Km
            </Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Image source={require('../assets/images/drop.png')} className="h-6 w-6"/>
            <Text className="text-white ml-1 font-semibold text-base">
              {current?.humidity}%
            </Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Image source={require('../assets/images/sunicon.png')} className="h-6 w-6"/>
            <Text className="text-white ml-1 font-semibold text-base">
              {weather?.forecast?.forecastday[0]?. astro?.sunrise}
            </Text>
          </View>
        </View>
      </View>

      {/* Forecast for next days */}  
      <View className="mb-3 space-y-3">
        <View className="flex-row items-center mx-5 gap-2 space-x-2">
          <CalendarDaysIcon size={22} color={"white"}/>
          <Text className="text-white pt-1 text-base">Daily Forecast</Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 15}}
          showsHorizontalScrollIndicator={false}
        >
          {
            weather?.forecast?.forecastday?.map((item, index)=> {
              let date = new Date(item.date)
              let options = {weekday: 'long'}
              let dayName = date.toLocaleDateString('en-US', options);
              dayName = dayName.split(',')[0]
              
              return(
                <View
                  key={index}
                  className="flex justify-center items-center w-24 rounded-3xl py-3 my-2 mr-4"
                  style={{backgroundColor: theme.bgWhite(0.15)}}
                >
                  <Image source={weatherImages[item?.day?.condition?.text]}
                    className="h-11 w-11 "
                  />
                  <Text className="text-white">{dayName}</Text>
                  <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                </View>  
              )
            })
          }
        </ScrollView>
      </View>
      </View>
      )
    }
      
    </View>
  );
};

export default HomeScreen;
