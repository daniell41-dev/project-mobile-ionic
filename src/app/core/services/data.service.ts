import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import { Card } from '../models/card.model';
import { Contact } from '../models/contact.model';
import { SavingsGoal } from '../models/savings-goal.model';
import { AppNotification } from '../models/notification.model';
import { TRANSACTION_REPOSITORY } from '../repositories/transaction.repository';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly txRepo = inject(TRANSACTION_REPOSITORY);

  constructor() {
    // Los movimientos se cargan desde el repositorio (patrón Repository):
    // in-memory por defecto, o HTTP+MSW si environment.useMockApi es false.
    // Con la implementación in-memory la emisión es síncrona (of()).
    this.txRepo.getAll().subscribe(list => this._transactions.set(list));
  }

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

  // Respaldado por TransactionRepository (se hidrata en el constructor).
  private readonly _transactions = signal<Transaction[]>([]);
  readonly transactions = this._transactions.asReadonly();

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
      creditAvailable: 32000,
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
    { name: 'Compras',       percent: 32, amount: 4180, color: '#4C8DFF' },
    { name: 'Servicios',     percent: 18, amount: 2350, color: '#3FD1A0' },
    { name: 'Transporte',    percent: 15, amount: 1960, color: '#F5A623' },
    { name: 'Comida',        percent: 13, amount: 1700, color: '#B98BFF' },
    { name: 'Suscripciones', percent: 9,  amount: 1175, color: '#FF8A8A' },
    { name: 'Otros',         percent: 13, amount: 1700, color: '#7C879A' },
  ]);

  readonly statsMonthly = signal([
    { month: 'Ene', amount: 5500 },
    { month: 'Feb', amount: 7200 },
    { month: 'Mar', amount: 4800 },
    { month: 'Abr', amount: 8400 },
    { month: 'May', amount: 6600 },
    { month: 'Jun', amount: 9300, current: true },
  ]);

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions().find(t => t.id === id);
  }

  getRecentContacts(): Contact[] {
    return this.contacts().filter(c => c.recent);
  }
}
