package blockradar

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	apiKey     string
	baseURL    string
	httpClient *http.Client
}

func NewClient(apiKey, baseURL string) *Client {
	if baseURL == "" {
		baseURL = "https://api.blockradar.io/v1"
	}
	return &Client{
		apiKey:  apiKey,
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type CreateChildWalletRequest struct {
	Name  string `json:"name"`
	Chain string `json:"chain"`
}

type CreateChildWalletResponse struct {
	WalletAddress string `json:"wallet_address"`
	WalletID      string `json:"wallet_id"`
}

type SwapRequest struct {
	FromCurrency string  `json:"from_currency"`
	ToCurrency   string  `json:"to_currency"`
	Amount       float64 `json:"amount"`
	ToAddress    string  `json:"to_address"`
	Chain        string  `json:"chain"`
}

type SwapResponse struct {
	SwapID       string  `json:"swap_id"`
	ExpectedUSDC float64 `json:"expected_usdc"`
	Rate         float64 `json:"rate"`
	Status       string  `json:"status"`
}

type AMLCheckRequest struct {
	WalletAddress string `json:"wallet_address"`
	Chain         string `json:"chain"`
}

type AMLCheckResponse struct {
	Risk   string `json:"risk"`
	Score  float64 `json:"score"`
	Status string `json:"status"`
}

func (c *Client) CreateChildWallet(userID, chain string) (*CreateChildWalletResponse, error) {
	if chain == "" {
		chain = "base"
	}

	reqBody := CreateChildWalletRequest{
		Name:  fmt.Sprintf("bridge-user-%s", userID),
		Chain: chain,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/wallets/child", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var walletResp CreateChildWalletResponse
	if err := json.NewDecoder(resp.Body).Decode(&walletResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &walletResp, nil
}

func (c *Client) ExecuteSwap(req SwapRequest) (*SwapResponse, error) {
	jsonBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", c.baseURL+"/swap/master-wallet/execute", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var swapResp SwapResponse
	if err := json.NewDecoder(resp.Body).Decode(&swapResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &swapResp, nil
}

func (c *Client) CheckAML(walletAddress, chain string) (*AMLCheckResponse, error) {
	reqBody := AMLCheckRequest{
		WalletAddress: walletAddress,
		Chain:         chain,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/aml/check", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var amlResp AMLCheckResponse
	if err := json.NewDecoder(resp.Body).Decode(&amlResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &amlResp, nil
}
