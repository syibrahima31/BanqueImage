
import paydunya
from paydunya import InvoiceItem, Store


PAYDUNYA_ACCESS_TOKENS = {
  'PAYDUNYA-MASTER-KEY': "Sadg619E-EOft-cHEB-58wn-8qhaBwrL9MWx",
  'PAYDUNYA-PRIVATE-KEY': "test_private_Rk5G78SoEqk8XcK7lOi7Ir4D2WD",
  'PAYDUNYA-TOKEN': "IqiqDGmt44AvRgGoF1ra"
}

# Activer le mode 'test'. Le debug est à False par défaut
paydunya.debug = True

# Configurer les clés d'API
paydunya.api_keys = PAYDUNYA_ACCESS_TOKENS

store = Store(name='Ma banque d\'images')
invoice = paydunya.Invoice(store)

items = [
  InvoiceItem(
    name="Chaussures Croco",
    quantity=3,
    unit_price="10000",
    total_price="30000",
    description="Chaussures faites en peau de crocrodile authentique qui chasse la pauvreté"
  ),
  InvoiceItem(
    name="Chemise Glacée",
    quantity=1,
    unit_price="5000",
    description="Belle chemise",
    total_price="5000"
  ),
]

invoice.add_items(items)
invoice.total_amount = 42300


