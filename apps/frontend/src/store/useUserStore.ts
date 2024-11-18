import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  id: string;
  username: string;
  nickname: string;
  email: string;
  headPic?: string;
  phoneNumber?: string;
}
interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}
const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "user-storage" }
  )
);

export default useUserStore;
