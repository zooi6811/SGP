import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from datetime import datetime
import logic
import database

class SGPPlannerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SGP Production Management System")
        self.geometry("1200x800")
        
        # Style
        style = ttk.Style(self)
        style.theme_use('clam')
        style.configure("Treeview", rowheight=25)
        style.configure("Treeview.Heading", font=('Arial', 10, 'bold'))

        style.configure("Good.TLabelframe.Label", foreground="green")
        style.configure("Bad.TLabelframe.Label", foreground="red")
        style.configure("Normal.TLabelframe.Label", foreground="black")
        
        self.create_widgets()

    def create_widgets(self):
        # Header
        header = tk.Frame(self, bg="#2c3e50", height=60)
        header.pack(fill="x")
        tk.Label(header, text="SGP PRODUCTION MANAGEMENT SYSTEM", 
                 fg="white", bg="#2c3e50", font=("Arial", 16, "bold")).pack(pady=15)

        # Tabs
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.tab_prod = ttk.Frame(self.notebook)
        self.tab_inv = ttk.Frame(self.notebook)
        self.tab_daily = ttk.Frame(self.notebook)
        self.tab_mach = ttk.Frame(self.notebook) # NEW TAB
        
        self.notebook.add(self.tab_prod, text="  📅 Planning  ")
        self.notebook.add(self.tab_inv, text="  📦 Inventory  ")
        self.notebook.add(self.tab_daily, text="  ✅ Daily Production  ")
        self.notebook.add(self.tab_mach, text="  ⚙️ Machine Status  ") # NEW TAB
        
        self.build_prod_tab()
        self.build_inv_tab()
        self.build_daily_tab()
        self.build_mach_tab() # Build it

    def build_mach_tab(self):
        frame = self.tab_mach
        
        # Scrollable Canvas Setup
        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        self.machine_widgets = {} 

        # Create Grid of Machine Cards
        row = 0
        col = 0
        MAX_COLS = 3 

        # --- FIX: Ensure we loop through the machines ---
        import database # Ensure this is accessible
        
        for i, machine in enumerate(database.MACHINES):
            row = i // MAX_COLS
            col = i % MAX_COLS
            
            # --- THE FIX IS HERE: Change tk.LabelFrame to ttk.LabelFrame ---
            card = ttk.LabelFrame(scrollable_frame, text=f" {machine.machine_id} - {machine.machine_type} ", padding=10)
            card.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
            
            # Info Label
            info_text = f"Max Width: {machine.max_width_mm}\nMat: {machine.materials}"
            tk.Label(card, text=info_text, justify="left", fg="gray").pack(anchor="w")
            
            # Status Dropdown
            tk.Label(card, text="Status:").pack(anchor="w", pady=(5,0))
            status_var = tk.StringVar(value=machine.status)
            status_combo = ttk.Combobox(card, textvariable=status_var, 
                                      values=["Running", "Idle", "Maintenance", "Breakdown"], 
                                      state="readonly")
            status_combo.pack(fill="x")
            
            # Color Coding Logic
            self.update_card_color(card, machine.status)
            
            # Bind change event
            # We use a helper function to avoid the "lambda closure" bug where all buttons control the last machine
            status_combo.bind("<<ComboboxSelected>>", 
                            lambda event, c=card, v=status_var: self.on_status_change(c, None, v))

            # Notes Field
            tk.Label(card, text="Notes:").pack(anchor="w", pady=(5,0))
            note_entry = ttk.Entry(card)
            note_entry.insert(0, machine.notes)
            note_entry.pack(fill="x")
            
            # Update Button
            btn = ttk.Button(card, text="Update Status", 
                           command=lambda m=machine, v=status_var, n=note_entry: self.save_machine_status(m, v, n))
            btn.pack(pady=10, fill="x")

    def update_card_color(self, card_frame, status):
        """Changes the style based on status (Fixes TclError)"""
        if status == "Running":
            card_frame.configure(style="Good.TLabelframe")
        elif status == "Maintenance" or status == "Breakdown":
            card_frame.configure(style="Bad.TLabelframe")
        else:
            card_frame.configure(style="Normal.TLabelframe")

    def on_status_change(self, card, machine, var):
        self.update_card_color(card, var.get())

    def save_machine_status(self, machine, status_var, note_entry):
        new_status = status_var.get()
        new_note = note_entry.get()
        
        if logic.update_machine_status(machine.machine_id, new_status, new_note):
            messagebox.showinfo("Updated", f"{machine.machine_id} is now {new_status}")
        else:
            messagebox.showerror("Error", "Failed to update machine.")

    def build_prod_tab(self):
        frame = self.tab_prod
        
        # Inputs
        panel = ttk.LabelFrame(frame, text="New Job", padding=15)
        panel.pack(side="left", fill="y", padx=10, pady=10)
        
        # Input Fields
        self.entry_jid = self.create_input(panel, "Job ID:", 0)
        self.entry_cli = self.create_input(panel, "Client:", 1)
        self.entry_wgt = self.create_input(panel, "Weight (kg):", 2)
        
        ttk.Label(panel, text="Recipe:").grid(row=6, column=0, sticky="w")
        self.combo_rcp = ttk.Combobox(panel, values=list(database.RECIPES.keys()), state="readonly")
        self.combo_rcp.grid(row=7, column=0, pady=5)
        
        self.entry_due = self.create_input(panel, "Due Date:", 4)
        self.entry_due.insert(0, datetime.now().strftime("%Y-%m-%d"))

        ttk.Button(panel, text="Add Job", command=self.add_job_action).grid(row=10, column=0, sticky="ew", pady=10)
        ttk.Button(panel, text="Delete Selected", command=self.del_job_action).grid(row=11, column=0, sticky="ew")

        # Table
        cols = ("ID", "Client", "Weight", "Recipe", "Due")
        self.tree_jobs = ttk.Treeview(frame, columns=cols, show='headings')
        for c in cols: self.tree_jobs.heading(c, text=c)
        self.tree_jobs.pack(fill="both", expand=True, padx=10, pady=10)
        
        # --- FIX: LOAD DATA ON STARTUP ---
        self.refresh_job_list() 

    def create_input(self, parent, label, idx):
        ttk.Label(parent, text=label).grid(row=idx*2, column=0, sticky="w")
        entry = ttk.Entry(parent, width=25)
        entry.grid(row=idx*2+1, column=0, pady=2)
        return entry

    def build_inv_tab(self):
        frame = self.tab_inv
        toolbar = tk.Frame(frame, pady=10)
        toolbar.pack(fill="x", padx=10)
        
        ttk.Button(toolbar, text="Refresh", command=self.refresh_inv).pack(side="left")
        ttk.Button(toolbar, text="Restock", command=self.restock_action).pack(side="right")
        
        cols = ("Material", "Stock", "Needed", "Available", "Status")
        self.tree_inv = ttk.Treeview(frame, columns=cols, show='headings')
        for c in cols: self.tree_inv.heading(c, text=c)
        self.tree_inv.pack(fill="both", expand=True, padx=10)
        
        self.tree_inv.tag_configure('CRITICAL', background='#f8d7da')
        self.tree_inv.tag_configure('LOW', background='#fff3cd')
        
        # --- FIX: LOAD DATA ON STARTUP ---
        self.refresh_inv() 

    def build_daily_tab(self):
        frame = self.tab_daily
        
        # --- LEFT: INPUT ---
        panel = ttk.LabelFrame(frame, text="Record Daily Output", padding=15)
        panel.pack(side="left", fill="y", padx=10, pady=10)
        
        # Job Selection
        ttk.Label(panel, text="Select Job:").grid(row=0, column=0, sticky="w")
        self.combo_log_job = ttk.Combobox(panel, width=25)
        self.combo_log_job.grid(row=1, column=0, pady=5)
        self.combo_log_job.bind("<Button-1>", self.refresh_job_dropdown)
        
        # Date
        ttk.Label(panel, text="Date (YYYY-MM-DD):").grid(row=2, column=0, sticky="w")
        self.entry_log_date = ttk.Entry(panel, width=28)
        self.entry_log_date.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.entry_log_date.grid(row=3, column=0, pady=5)
        
        # Output Amount
        ttk.Label(panel, text="✅ Output (kg):").grid(row=4, column=0, sticky="w")
        self.entry_log_out = ttk.Entry(panel, width=28)
        self.entry_log_out.grid(row=5, column=0, pady=5)

        # Wastage Amount
        ttk.Label(panel, text="❌ Wastage (kg):").grid(row=6, column=0, sticky="w", pady=(10,0))
        self.entry_log_waste = ttk.Entry(panel, width=28)
        self.entry_log_waste.insert(0, "0") 
        self.entry_log_waste.grid(row=7, column=0, pady=5)
        
        # Submit Button
        btn = ttk.Button(panel, text="💾 Confirm Production", command=self.submit_log_action)
        btn.grid(row=8, column=0, sticky="ew", pady=20)
        
        # --- RIGHT: HISTORY TABLE ---
        right_panel = ttk.Frame(frame)
        right_panel.pack(side="right", fill="both", expand=True, padx=10, pady=10)
        
        cols = ("Log ID", "Date", "Job ID", "Output", "Wastage", "Materials Consumed")
        self.tree_log = ttk.Treeview(right_panel, columns=cols, show='headings')
        
        for c in cols: 
            self.tree_log.heading(c, text=c)
            self.tree_log.column(c, width=80)
            
        self.tree_log.column("Materials Consumed", width=300)
        self.tree_log.pack(fill="both", expand=True)
        
        # --- FIX: LOAD DATA ON STARTUP ---
        self.refresh_log_history()
        # Initialize dropdown too
        self.refresh_job_dropdown(None)

    # --- ACTIONS & REFRESH LOGIC ---

    def refresh_job_list(self):
        """Clears and reloads the Jobs table from database.JOBS"""
        for item in self.tree_jobs.get_children():
            self.tree_jobs.delete(item)
            
        for job in database.JOBS:
            self.tree_jobs.insert("", "end", values=(job.job_id, job.client, job.weight, job.recipe_code, job.due_date))

    def refresh_log_history(self):
        """Clears and reloads the Logs table from database.LOGS"""
        for item in self.tree_log.get_children():
            self.tree_log.delete(item)
            
        for log in database.LOGS:
            mat_str = ", ".join([f"{k}: {v}kg" for k,v in log.materials_consumed.items()])
            self.tree_log.insert("", "end", values=(
                log.log_id, log.date, log.job_id, 
                f"{log.output_kg} kg", f"{log.wastage_kg} kg", mat_str
            ))

    def refresh_job_dropdown(self, event):
        job_ids = [j.job_id for j in database.JOBS]
        self.combo_log_job['values'] = job_ids

    def refresh_inv(self):
        for i in self.tree_inv.get_children(): self.tree_inv.delete(i)
        
        report = logic.calculate_material_requirements()
        
        for mat, data in report.items():
            self.tree_inv.insert("", "end", values=(
                mat, data['stock'], data['needed'], data['available'], data['status']
            ), tags=(data['status'],))

    def add_job_action(self):
        try:
            job = logic.add_new_job(
                self.entry_jid.get(), self.entry_cli.get(), "Std", 
                self.entry_wgt.get(), self.combo_rcp.get(), self.entry_due.get()
            )
            self.refresh_job_list() # Use the refresh function now
            self.refresh_inv()
            
            # Clear Inputs
            self.entry_jid.delete(0, tk.END)
            self.entry_cli.delete(0, tk.END)
            self.entry_wgt.delete(0, tk.END)
            self.combo_rcp.set('')
            
            messagebox.showinfo("Success", "Job added successfully.")
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def del_job_action(self):
        sel = self.tree_jobs.selection()
        if sel:
            item = self.tree_jobs.item(sel)
            logic.delete_job_by_id(item['values'][0])
            self.refresh_job_list()
            self.refresh_inv()

    def submit_log_action(self):
        jid = self.combo_log_job.get()
        date = self.entry_log_date.get()
        out = self.entry_log_out.get()
        waste = self.entry_log_waste.get()
        
        if not (jid and out and waste):
            messagebox.showerror("Error", "Please fill in all fields.")
            return
            
        try:
            log_entry = logic.submit_daily_log(jid, date, out, waste)
            
            self.refresh_log_history() # Update table
            self.refresh_inv()         # Update inventory
            
            messagebox.showinfo("Success", "Production recorded.")
            self.entry_log_out.delete(0, tk.END)
            self.entry_log_waste.delete(0, tk.END)
            self.entry_log_waste.insert(0, "0")
            
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def restock_action(self):
        mat = simpledialog.askstring("Restock", "Material Name:")
        if mat:
            qty = simpledialog.askfloat("Restock", "Qty (kg):")
            if logic.restock_material(mat, qty):
                self.refresh_inv()
            else:
                messagebox.showerror("Error", "Material not found")