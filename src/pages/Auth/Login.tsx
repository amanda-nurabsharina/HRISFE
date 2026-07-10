import {
  Form,
  FormButton,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "../../components/forms";
import { RouteLink } from "../../components/ui";
import { useLoginForm } from "./useLoginForm";
import { KeyRound, Mail, ShieldAlert } from "lucide-react";

export const Login = () => {
  const {
    form,
    form: {
      formState: { isSubmitting },
      control,
    },
    handleSubmit,
  } = useLoginForm({ defaultValues: { email: "", password: "" } });

  return (
    <div className="w-full max-w-md px-6 py-8 md:px-8 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl shadow-zinc-100/40 dark:shadow-none transition-all duration-300">
      <Form {...form}>
        <form
          className="grid gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mt-2">
              HRIS Portal
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign in with your credentials to access the system
            </p>
          </div>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@hris.com"
                        className="pl-10 h-10 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500 rounded-lg"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <div className="flex items-center">
                    <FormLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Password
                    </FormLabel>
                    <RouteLink
                      to="/auth/forgotPassword"
                      className="ml-auto text-xs text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline"
                    >
                      Forgot?
                    </RouteLink>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-10 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500 rounded-lg"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormButton
              className="w-full mt-2 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Access HRIS
            </FormButton>
          </div>
          <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            Use <span className="font-semibold text-zinc-600 dark:text-zinc-300">admin@hris.com</span> & <span className="font-semibold text-zinc-600 dark:text-zinc-300">admin123</span> to login.
          </div>
        </form>
      </Form>
    </div>
  );
};
