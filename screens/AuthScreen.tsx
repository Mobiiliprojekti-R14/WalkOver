// screens/AuthScreen.tsx

// "Auth-portti" -> näyttää login tai SignUp

import React, { useState } from "react"
import { LoginScreen } from "./LoginScreen"
import { SignUpScreen } from "./SignUpScreen"

export function AuthScreen() {
    // true = Login, false = SignUp
    const [isLogin, setIsLogin] = useState(true)

    if (isLogin) {
        return <LoginScreen onSwitchToSignUp={() => setIsLogin(false)} />
    }

    return <SignUpScreen onSwitchToLogin={() => setIsLogin(true)} />
}