import { create } from "zustand";

interface UserStore {
  user: {
    id: string;
    username: string;
    nickname: string;
    email: string;
    headPic?: string;
    phoneNumber?: string;
  } | null;
  setUser: (user: UserStore["user"]) => void;
  clearUser: () => void;
}
const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
