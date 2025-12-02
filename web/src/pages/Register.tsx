import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cream to-gold-50">
            <Card className="w-full max-w-md p-8 islamic-card">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🕌</div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Inscription
                    </h1>
                    <p className="text-navy/70">
                        Créez votre compte pour commencer
                    </p>
                </div>

                {success ? (
                    <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 p-4 rounded-lg text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="font-semibold mb-2">Inscription réussie !</p>
                        <p className="text-sm">
                            Vérifiez votre email pour confirmer votre compte.
                        </p>
                        <p className="text-xs mt-2 text-emerald-600">
                            Redirection vers la connexion...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-lg text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-navy font-semibold">
                                👤 Nom complet
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="border-2 border-emerald-200 focus:border-emerald-500"
                                placeholder="Ahmed Mohammed"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-navy font-semibold">
                                📧 Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-2 border-emerald-200 focus:border-emerald-500"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-navy font-semibold">
                                🔒 Mot de passe
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="border-2 border-emerald-200 focus:border-emerald-500"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-navy/60">
                                Minimum 6 caractères
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-navy font-semibold">
                                🔒 Confirmer le mot de passe
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="border-2 border-emerald-200 focus:border-emerald-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3"
                            disabled={loading}
                        >
                            {loading ? '⏳ Inscription...' : '✅ S\'inscrire'}
                        </Button>
                    </form>
                )}

                <p className="text-center mt-6 text-sm text-navy/70">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                        Se connecter
                    </Link>
                </p>
            </Card>
        </div>
    );
}
