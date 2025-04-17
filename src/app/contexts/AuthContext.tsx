"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

interface IUser {
    name: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    loggedIn: boolean;
    loading: boolean;
    error: string;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    loggedIn: false,
    loading: false,
    error: "",
    login: () => { },
    register: () => { },
    logout: () => { }
});

export const useAuth = () => {
    return useContext(AuthContext);
}

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
})

const loginSchema = z.object({
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
})

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/me', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const response_data = await response.json();
                    const userData = response_data.message as IUser;
                    setUser(userData);
                    setLoggedIn(true);
                }
                else {
                    setUser({
                        name: "",
                        email: ""
                    })
                    setLoggedIn(false);
                }
            }
            catch {
                setUser({
                    name: "",
                    email: ""
                })
                setLoggedIn(false);
                setError("An error occurred while checking auth status.")
            }
            finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const validated = loginSchema.safeParse({ email, password });
            if (!validated.success) {
                setError(validated.error.errors[0].message);
                return;
            }
            setLoading(true);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            if (response.ok) {
                const response_data = await response.json();
                const userData = response_data.message as IUser;
                setUser(userData);
                setLoggedIn(true);
                setError("");
            } else {
                setUser({
                    name: "",
                    email: ""
                })
                setLoggedIn(false);
                setError("Invalid credentials.")
            }

        }
        catch {
            setError("An error occurred while logging in.");
            setLoggedIn(false);
        }
        finally {
            setLoading(false);
        }

    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const validated = registerSchema.safeParse({ name, email, password });
            if (!validated.success) {
                setError(validated.error.errors[0].message);
                return;
            }
            setLoading(true);
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            })

            if (response.ok) {
                const response_data = await response.json();
                const userData = response_data.message as IUser;
                setUser(userData);
                setLoggedIn(true);
                setError("");
            } else {
                const response_data = await response.json();
                setError(response_data.message);
                setLoggedIn(false);
            }
        }
        catch {
            setError("An error occurred while registering.");
            setLoggedIn(false);
        }
        finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include'
            })

            setLoggedIn(false);
            setUser({
                name: "",
                email: ""
            })
            setError("")
        }
        catch {
            setError("An error occurred while logging out.");
        }
        finally {
            setLoading(false);
        }
    }

    const value: IAuthContext = {
        user,
        loggedIn,
        loading,
        error,
        login,
        register,
        logout
    }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}


