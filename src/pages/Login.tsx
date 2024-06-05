import { ROUTE_PATHS } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/constants";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

function Login({}: Props) {
  const { toast } = useToast();
  const { authData, setAuthData } = useStore();
  const [publisherForm, setPublisherForm] = useState({
    publisherEmail: "",
    publisherPassword: "",
  });

  const [userForm, setUserForm] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleUserLogin = async (e: any) => {
    e.preventDefault();
    try {
      let { data } = await axios.post(`${BASE_URL}/user/login`, {
        email: userForm.userEmail,
        password: userForm.userPassword,
      });

      if (data.data) {
        setAuthData(data.data);
      } else if (data.error) {
        toast({
          title: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  };

  const handlePublisherLogin = async (e: any) => {
    e.preventDefault();
    try {
      let { data } = await axios.post(`${BASE_URL}/publisher/login`, {
        email: publisherForm.publisherEmail,
        password: publisherForm.publisherPassword,
      });

      if (data.data) {
        setAuthData(data.data);
      } else {
        toast({
          title: "Unknown error, please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unknown error, please try again",
        variant: "destructive",
      });
    }
  };

  const handleUserFormChange = (e: any) => {
    setUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePublisherFormChange = (e: any) => {
    setPublisherForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return authData ? (
    <Navigate to={`../${ROUTE_PATHS.DASHBOARD}`} />
  ) : (
    <div className="w-full min-h-screen h-full bg-background flex flex-col items-center gap-6 justify-center">
      <h1 className="text-4xl font-semibold">TodayQ Assignment</h1>
      <div className="flex flex-wrap items-center justify-center w-full gap-6">
        {/* Publisher login */}
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Publisher Login</CardTitle>
            <CardDescription>
              Enter your details below to login as publisher.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handlePublisherLogin}
              action=""
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="publisherEmail">Email</Label>
                <Input
                  id="publisherEmail"
                  onChange={handlePublisherFormChange}
                  type="email"
                  name="publisherEmail"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  onChange={handlePublisherFormChange}
                  name="publisherPassword"
                  id="publisherPassword"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* User login */}
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">User Login</CardTitle>
            <CardDescription>
              Enter your details below to login as user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="" onSubmit={handleUserLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  onChange={handleUserFormChange}
                  type="email"
                  name="userEmail"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="userPassword">Password</Label>
                </div>
                <Input
                  onChange={handleUserFormChange}
                  name="userPassword"
                  id="userPassword"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
