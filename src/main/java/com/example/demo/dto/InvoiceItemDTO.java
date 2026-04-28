package com.example.demo.dto;

import java.math.BigDecimal;

public class InvoiceItemDTO {

    private Integer itemId;
    private String description;
    private BigDecimal amount;
    private Integer invoiceId;

    public InvoiceItemDTO() {}

    public InvoiceItemDTO(Integer itemId, String description, BigDecimal amount, Integer invoiceId) {
        this.itemId = itemId;
        this.description = description;
        this.amount = amount;
        this.invoiceId = invoiceId;
    }

    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }
}