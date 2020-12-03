import React , { useState, useRef, useCallback } from 'react';

import { 
     Image,
     View,
     ScrollView,
     KeyboardAvoidingView ,
     Platform,
     TextInput, 
     Alert
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { 
     Container,
     Title, 
     BackToSignIn,
     BackToSignInText 
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';


import logoImg from '../../assets/logo.png';
interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState();

    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const handleSignUp = useCallback( async (data: object) => {
        try {
            data["type"] = selectedValue;
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email("Digite um e-mail válido"),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });
            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);
            Alert.alert('Cadastro realizado com sucesso !', 'Você já pode fazer login na aplicação');
            navigation.goBack();

        } catch (err) {
            if (err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);
                console.log(errors);
                Alert.alert(
                    'Erro no cadastro',
                    'Occorreu um erro ao fazer o cadastro, tente novamente',
                );
            }
            console.log(err);
            Alert.alert(
                'Erro no cadastro',
                'Occorreu um erro ao fazer o cadastro, tente novamente',
            );
        }

    },[navigation]);
    return (
        <>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding': undefined }
            style={{flex: 1}}
            enabled
        >
            <ScrollView 
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                >
                <Container>
                    <Image source={logoImg} />
                    <View>
                        <Title>Crie sua conta</Title>
                    </View>
                    <Form ref={formRef} onSubmit={handleSignUp}>
                        <Picker
                            selectedValue={selectedValue}
                            style={{height: 80 }}
                            onValueChange={(itemValue, itemIndex) => 
                            setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="Quero adotar" value="adopter" />
                            <Picker.Item label="Sou uma instituição" value="institution" />
                        </Picker>
                        <Input 
                            autoCapitalize="words" 
                            name="name" 
                            icon="user" 
                            placeholder="Nome"  
                            returnKeyType="next"
                            onSubmitEditing={() => { 
                                emailInputRef.current?.focus();
                            }}
                        />
                        <Input
                            ref={emailInputRef}
                            keyboardType="email-address"
                            autoCapitalize="none" 
                            autoCorrect={false} 
                            name="email" 
                            icon="mail" 
                            placeholder="Email"
                            returnKeyType="next"
                            onSubmitEditing={() => { 
                                passwordInputRef.current?.focus();
                            }}
                        />
                        <Input 
                            ref={passwordInputRef}
                            secureTextEntry 
                            name="password" 
                            textContentType="newPassword" 
                            icon="lock" 
                            placeholder="Senha" 
                            returnKeyType="send" 
                            onSubmitEditing={() => { formRef.current.submitForm();}}
                        />
                        
                    </Form>
                    <Button onPress={() => { formRef.current.submitForm();} }>Criar</Button>

                </Container>
            </ScrollView>
        </KeyboardAvoidingView>
        <BackToSignIn onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#000" />
            <BackToSignInText>
                Voltar para logon
            </BackToSignInText>
        </BackToSignIn>
        </>
    );

    
};

export default SignUp;