import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import { Card } from '../models/card.model';
import { Contact } from '../models/contact.model';
import { SavingsGoal } from '../models/savings-goal.model';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class DataService {

  readonly user = signal<User>({
    id: 'u1',
    name: 'Andrea Salas',
    firstName: 'Andrea',
    email: 'andrea.salas@gmail.com',
    avatarInitials: 'AS',
    clabe: '646180123456784821',
    verified: true,
  });

  readonly balance = signal<number>(48250.75);
  readonly balanceChange = signal<number>(4.2);

  readonly transactions = signal<Transaction[]>([
    {
      id: 't1', type: 'income', amount: 18400,
      merchant: 'Nómina · ACME S.A.', category: 'Ingresos',
      categoryIcon: 'cash', categoryColor: '#3FD1A0',
      date: new Date(), time: '08:02', day: 'Hoy',
      status: 'completed', reference: 'NOM202406010001', method: 'SPEI', fee: 0,
    },
    {
      id: 't2', type: 'expense', amount: 199,
      merchant: 'Spotify Premium', category: 'Entretenimiento',
      categoryIcon: 'musical-notes', categoryColor: '#4C8DFF',
      date: new Date(), time: '07:41', day: 'Hoy',
      status: 'completed', reference: 'SPT202406010001', method: 'Cargo automático', fee: 0,
    },
    {
      id: 't3', type: 'expense', amount: 1250,
      merchant: 'Mercado Pago', category: 'Compras',
      categoryIcon: 'bag-handle', categoryColor: '#F5A623',
      date: new Date(Date.now() - 86400000), time: '15:30', day: 'Ayer',
      status: 'completed', reference: 'MP202405310001', method: 'Tarjeta débito', fee: 0,
    },
    {
      id: 't4', type: 'expense', amount: 340,
      merchant: 'Uber', category: 'Transporte',
      categoryIcon: 'car', categoryColor: '#9B59B6',
      date: new Date(Date.now() - 86400000), time: '09:15', day: 'Ayer',
      status: 'completed', reference: 'UBR202405310002', method: 'Cargo automático', fee: 0,
    },
    {
      id: 't5', type: 'expense', amount: 520,
      merchant: 'Costco', category: 'Supermercado',
      categoryIcon: 'storefront', categoryColor: '#E74C3C',
      date: new Date(Date.now() - 2 * 86400000), time: '12:00', day: '4 jun',
      status: 'completed', reference: 'CST202405300001', method: 'Tarjeta débito', fee: 0,
    },
    {
      id: 't6', type: 'income', amount: 2500,
      merchant: 'Transferencia recibida', category: 'Ingresos',
      categoryIcon: 'cash', categoryColor: '#3FD1A0',
      date: new Date(Date.now() - 2 * 86400000), time: '10:22', day: '4 jun',
      status: 'completed', reference: 'TRF202405300002', method: 'SPEI', fee: 0,
    },
  ]);

  readonly cards = signal<Card[]>([
    {
      id: 'c1',
      type: 'debit',
      network: 'visa',
      lastFour: '4821',
      holder: 'ANDREA SALAS',
      expiryMonth: '09',
      expiryYear: '28',
      balance: 48250.75,
      creditAvailable: 0,
      frozen: false,
      onlinePurchases: true,
    },
  ]);

  readonly contacts = signal<Contact[]>([
    { id: 'c1', name: 'Luis Ramírez', initials: 'LR', bank: 'BBVA', clabe: '012180012345678901', recent: true },
    { id: 'c2', name: 'María Torres', initials: 'MT', bank: 'Banamex', clabe: '002180012345678902', recent: true },
    { id: 'c3', name: 'Carlos Méndez', initials: 'CM', bank: 'Santander', clabe: '014180012345678903', recent: true },
    { id: 'c4', name: 'Ana García', initials: 'AG', bank: 'Banorte', clabe: '006180012345678904', recent: false },
    { id: 'c5', name: 'Pedro López', initials: 'PL', bank: 'HSBC', clabe: '021180012345678905', recent: false },
  ]);

  readonly savingsGoals = signal<SavingsGoal[]>([
    {
      id: 'sg1',
      name: 'Vacaciones · Oaxaca',
      icon: 'flame',
      current: 12400,
      target: 20000,
      progress: 0.62,
    },
  ]);

  readonly notifications = signal<AppNotification[]>([
    {
      id: 'n1',
      icon: 'cash',
      iconColor: '#3FD1A0',
      title: 'Nómina recibida',
      description: 'ACME S.A. te depositó $18,400.00 vía SPEI.',
      time: 'Hace 2 h',
      read: false,
    },
    {
      id: 'n2',
      icon: 'shield-checkmark',
      iconColor: '#4C8DFF',
      title: 'Inicio de sesión detectado',
      description: 'Se detectó un acceso desde un nuevo dispositivo. ¿Fuiste tú?',
      time: 'Hace 5 h',
      read: false,
    },
    {
      id: 'n3',
      icon: 'flag',
      iconColor: '#F5A623',
      title: 'Meta al 62%',
      description: 'Llevas $12,400 de $20,000 en tu meta "Vacaciones · Oaxaca".',
      time: 'Ayer',
      read: true,
    },
    {
      id: 'n4',
      icon: 'document-text',
      iconColor: '#9B59B6',
      title: 'Estado de cuenta disponible',
      description: 'Tu estado de cuenta de mayo está listo para descargar.',
      time: '01 jun',
      read: true,
    },
  ]);

  readonly statsCategories = signal([
    { name: 'Alimentos',       percent: 32, amount: 2030, color: '#4C8DFF' },
    { name: 'Transporte',      percent: 18, amount: 1143, color: '#3FD1A0' },
    { name: 'Entretenimiento', percent: 15, amount:  952, color: '#F5A623' },
    { name: 'Compras',         percent: 20, amount: 1270, color: '#9B59B6' },
    { name: 'Servicios',       percent: 10, amount:  635, color: '#FF8A8A' },
    { name: 'Otros',           percent: 5,  amount:  320, color: '#626C7C' },
  ]);

  readonly statsMonthly = signal([
    { month: 'Ene', amount: 9200 },
    { month: 'Feb', amount: 7800 },
    { month: 'Mar', amount: 11400 },
    { month: 'Abr', amount: 8600 },
    { month: 'May', amount: 10200 },
    { month: 'Jun', amount: 6350, current: true },
  ]);

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions().find(t => t.id === id);
  }

  getRecentContacts(): Contact[] {
    return this.contacts().filter(c => c.recent);
  }
}
