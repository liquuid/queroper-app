import React, {useEffect, useState, useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faVenus, faMars } from '@fortawesome/free-solid-svg-icons'
import Logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import  api from '../../services/api';
import { useAuth, signOut } from '../../hooks/auth';

import { 
    Text,
    Image,
    View,
    ScrollView,
    KeyboardAvoidingView ,
    Platform,
    TextInput, 
    Alert
} from 'react-native';

import {
    Container,
    PetContainer,
    PetImage,
    PetList,
    Pet,
    PetTitle,
    PetDescription,
    PetButton,
    Header
  } from './styles';

interface Institution {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
}

interface Pet {
    id: string;
    name: string;
    has_faved_by: User[];
    has_asked_for_adoption: User[];
    info: string;
    header_name: string;
    image: string;
    institution: Institution;
    species: string;
    gender: string;
    avatar_url: string;
}

const Favorite: React.FC = () => {
  
    const { signOut, user } = useAuth();
    const navigation = useNavigation();
    const [ pets, setPets ] = useState<Pet[]>(() => {
        return [];
    });

    async function handleNavigate(id: string): Promise<void> {
      navigation.navigate('PetDetails', {
        id,
      });
    }
    useLayoutEffect(()=>{
    },[pets]);

    useEffect(()=>{
      async function loadPet(): Promise<void> {
        const user_data = await api.get(`/users/${user.id}`);
        setPets(user_data.data.favorite_pets);
      }
      loadPet();
    },[]);

    return (
        <Container>
        <Header>
          <Image style={{height: 80}} source={Logo} />
          <Icon
            name="log-out"
            size={24}
            color="#333"
            onPress={signOut}
          />
        </Header>
        <PetContainer>
          <PetList
            data={pets}
            keyExtractor={item => item.id}
            
            ListFooterComponentStyle={{
              height: 80,
            }}
            renderItem={({item}) => { 
              let genderIcon = faVenus;
              
              if(item.gender === "M"){
                genderIcon = faMars;
              }

              return(
              <Pet key={item.id} onPress={() => handleNavigate(item.id)}>
                <PetImage source={{uri: "https://qpapi.liquuid.me/files/"+item.avatar}} />
                  <PetTitle>{item.name}<FontAwesomeIcon icon={ genderIcon } size={24}/></PetTitle>
                <PetDescription>{item.info}</PetDescription>
              </Pet>
            )}}/>
        </PetContainer>
      </Container>
    );
}
export default Favorite;