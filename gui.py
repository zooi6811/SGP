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
        self.tab_daily = ttk.Frame(self.notebook) # NEW TAB
        
        self.notebook.add(self.tab_prod, text="  📅 Planning  ")
        self.notebook.add(self.tab_inv, text="  📦 Inventory  ")
        self.notebook.add(self.tab_daily, text="  ✅ Daily Production  ") # NEW TAB
        
        self.build_prod_tab()
        self.build_inv_tab()
        self.build_daily_tab() # Build the new tab

    def build_prod_tab(self):
        frame = self.tab_prod
        
        # Inputs
        panel = ttk.LabelFrame(frame, text="New Job", padding=15)
        panel.pack(side="left", fill="y", padx=10, pady=10)
        
        # Input Fields (Simplified for brevity)
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

    def refresh_job_dropdown(self, event):
        # Fetches the latest list of Job IDs from the database module
        # ensuring the dropdown is always up-to-date
        job_ids = [j.job_id for j in database.JOBS]
        self.combo_log_job['values'] = job_ids

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
        ttk.Label(panel, text="✅ Good Output (kg):").grid(row=4, column=0, sticky="w")
        self.entry_log_out = ttk.Entry(panel, width=28)
        self.entry_log_out.grid(row=5, column=0, pady=5)

        # Wastage Amount (NEW)
        ttk.Label(panel, text="❌ Wastage / Purge (kg):").grid(row=6, column=0, sticky="w", pady=(10,0))
        self.entry_log_waste = ttk.Entry(panel, width=28)
        self.entry_log_waste.insert(0, "0") # Default to 0
        self.entry_log_waste.grid(row=7, column=0, pady=5)
        
        # Submit Button
        btn = ttk.Button(panel, text="💾 Confirm Production", command=self.submit_log_action)
        btn.grid(row=8, column=0, sticky="ew", pady=20)
        
        # --- RIGHT: HISTORY TABLE ---
        right_panel = ttk.Frame(frame)
        right_panel.pack(side="right", fill="both", expand=True, padx=10, pady=10)
        
        # Added 'Wastage' column
        cols = ("Log ID", "Date", "Job ID", "Output", "Wastage", "Materials Consumed")
        self.tree_log = ttk.Treeview(right_panel, columns=cols, show='headings')
        
        for c in cols: 
            self.tree_log.heading(c, text=c)
            self.tree_log.column(c, width=80)
            
        self.tree_log.column("Materials Consumed", width=300)
        self.tree_log.pack(fill="both", expand=True)

    def submit_log_action(self):
        jid = self.combo_log_job.get()
        date = self.entry_log_date.get()
        out = self.entry_log_out.get()
        waste = self.entry_log_waste.get() # Get Waste
        
        if not (jid and out and waste):
            messagebox.showerror("Error", "Please fill in all fields.")
            return
            
        try:
            # Pass waste to logic
            log_entry = logic.submit_daily_log(jid, date, out, waste)
            
            # Format display string
            mat_str = ", ".join([f"{k}: {v}kg" for k,v in log_entry.materials_consumed.items()])
            
            # Update Table
            self.tree_log.insert("", "end", values=(
                log_entry.log_id, 
                log_entry.date, 
                log_entry.job_id, 
                f"{log_entry.output_kg} kg", 
                f"{log_entry.wastage_kg} kg", # Show Waste
                mat_str
            ))
            
            messagebox.showinfo("Success", "Production recorded. Inventory deducted.")
            self.entry_log_out.delete(0, tk.END)
            self.entry_log_waste.delete(0, tk.END)
            self.entry_log_waste.insert(0, "0")
            self.refresh_inv()
            
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def add_job_action(self):
        try:
            # Call Logic Module
            job = logic.add_new_job(
                self.entry_jid.get(), self.entry_cli.get(), "Std", 
                self.entry_wgt.get(), self.combo_rcp.get(), self.entry_due.get()
            )
            # Update UI
            self.tree_jobs.insert("", "end", values=(job.job_id, job.client, job.weight, job.recipe_code, job.due_date))
            self.refresh_inv()
            self.entry_jid.delete(0, tk.END) # Clear input
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def del_job_action(self):
        sel = self.tree_jobs.selection()
        if sel:
            item = self.tree_jobs.item(sel)
            logic.delete_job_by_id(item['values'][0])
            self.tree_jobs.delete(sel)
            self.refresh_inv()

    def refresh_inv(self):
        for i in self.tree_inv.get_children(): self.tree_inv.delete(i)
        
        # Get processed data from Logic
        report = logic.calculate_material_requirements()
        
        for mat, data in report.items():
            self.tree_inv.insert("", "end", values=(
                mat, data['stock'], data['needed'], data['available'], data['status']
            ), tags=(data['status'],))

    def restock_action(self):
        mat = simpledialog.askstring("Restock", "Material Name:")
        if mat:
            qty = simpledialog.askfloat("Restock", "Qty (kg):")
            if logic.restock_material(mat, qty):
                self.refresh_inv()
            else:
                messagebox.showerror("Error", "Material not found")