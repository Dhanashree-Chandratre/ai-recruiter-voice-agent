"use client";
import { UserDetailContext } from "../context/userDetailContext";
import { supabase } from "../services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";
import { Sidebar, SidebarProvider } from "../components/ui/sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";

export function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          setLoading(false);
          return;
        }
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error in fetchUser:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, loading }}>
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
            <SidebarTrigger />
          </main>
        </div>
      </SidebarProvider>
    </UserDetailContext.Provider>
  );
}
